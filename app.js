
import express from "express";
const app = express();

import dotenv from 'dotenv';
dotenv.config();

import jwt from 'jsonwebtoken';

import User from './models/user.js';
import Text from "./models/text.js";
import Blocklist from "./models/blocklist.js";

import backupText from "./models/backup.js";
import dayjs from 'dayjs';

import advancedFormat from 'dayjs/plugin/utc.js' // load on demand
import cookieParser from "cookie-parser";


//import ratelimit and cron jobs 
import rateLimit from 'express-rate-limit';
import loginSignupLimiter from './src/middlewares/rateLimitMiddleware.js';
import './src/utils/cronJobs.js';


dayjs.extend(advancedFormat) // use plugin

// path module and config
import path from "path";
import { dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));

import * as fs from 'fs';

//import startBox
import startBox from './src/helpers/startBox.js';


//connect to db and start server
import connectToDb from './src/config/dbConnect.js';

connectToDb().then(()=>{
 
  //start server with startbox
     app.listen(process.env.PORT, () => {
          console.log(startBox);
  })
 
}).catch((err)=>{
  console.log(err,'error connecting to db')
})

let trustproxy = process.env.Environment === 'production' ? 1 : 0;

app.set('trust proxy',trustproxy);


//import mongoStore which used to save session data 
import store from './src/config/mongoStore.js'

store.on('error', (error) => {
  console.log(error);
});

//import session middleware and use it
import sessionMiddleware from './src/middlewares/sessionMiddleware.js';

app.use(sessionMiddleware(store));


app.use(cookieParser());

app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

app.use(express.urlencoded({extended:true}));



app.get('/support',async(req,res)=>{

  
res.render('contactus',{email:process.env.SUPPORT || null })

});

app.post('/support',loginSignupLimiter,async(req,res)=>{
 try{ let isEmpty = (obj)=> Object.keys(obj).length === 0;
 
if(isEmpty(req.body)){

  res.status(400).send('BAD REQUEST: Missing required fields');
return;
}else{
 let {name,email,subject,message} = req.body;
 if(!name || !email || !subject || !message){
  res.status(400).send('BAD REQUEST: Missing required fields');
  return;
 }

 if(name.length<5 || name.length >50){
  res.status(400).send('BAD REQUEST: Name does not match required criteria');
  return;
}else if(email.length<7 || email.length >50){
  res.status(400).send('BAD REQUEST: Email does not match required criteria');
  return;
}else if(subject.length<5 || subject.length >200){
  res.status(400).send('BAD REQUEST: Subject does not match required criteria');
  return;
}else if(message.length<10 || message.length >500){
  res.status(400).send('BAD REQUEST: Message does not match required criteria');
  return;
}
}
  res.send('OK');
  
  const filepath = path.join(__dirname,'contactdata.json');

// Reading from the input file
fs.readFile(filepath, 'utf8', (readErr, data) => {
  if (readErr) {
    if (readErr.code === 'ENOENT') {
      console.error('Error: Input file not found.');
      data = '[]';
    } else {
      console.error('Error reading the input file:', readErr);
      return;
    }
   
  }
 
  let contactdata = req.body;
  if(!data){
    data = '[]';
  }
data = JSON.parse(data)
 data.push(req.body);
  // Writing to the output file
  fs.writeFile(filepath,JSON.stringify(data, null, 2), 'utf8', (writeErr) => {
    if (writeErr) {
      console.error('Error writing to the output file:', writeErr);
      return;
    }

    console.log('File write successful!');
  });
});
 }catch(e){
  console.log(e);
  res.send('Something went wrong!')
 }
})

app.get('/login',(req,res)=>{
 
  const errorMessage = req.session.errorMessage || '';
  req.session.errorMessage = '';

  if(req.session.user){

     res.redirect('/');
     return;
  }

  res.render('login', { error: errorMessage }); 
});

app.get('/signup',(req,res)=>{
res.render('signup');
});

app.post('/login',loginSignupLimiter, async (req, res) => {
  try {
    
    let { password, username } = req.body;
username = username.toLowerCase();


    if(username.length < 5){
      req.session.errorMessage = 'Username should be minimum of 5 chracters';
      return res.redirect('/login');
    }else if(password.length < 6){
      req.session.errorMessage = 'Password should be more than 6 characters';
      return res.redirect('/login');
    }


    // Check if the provided username or email exists in the database
    const user = await User.findOne({ $or: [{ username }, { email: username }] });

    const isBlockedUser = await Blocklist.findOne({ $or: [{ username }, { email: username }] });
   
    if (isBlockedUser) {

      req.session.errorMessage = 'Your account is suspended!'
      return res.redirect('/login');
    }

    if (!user) {
      req.session.errorMessage = 'User does not exist!';
      return res.redirect('/login');
    }

    // Compare the provided password with the stored hashed password
    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      req.session.errorMessage = 'Invalid username or password!';
      return res.redirect('/login');
    }
if(!user.isEmailVerified){
  let error = req.session.error || false;
  req.session.email = user.email;

  return res.render('verifyemail',{error:error});
}
    // Set the authenticated user in the session
    req.session.user = {
      userId: user._id,
      username: user.username,
    };

    res.redirect('/');
  } catch (error) {``
    console.error('Error during login:', error);
    // Handle errors appropriately
    res.redirect('/login');
  }
});

import nodemailer from 'nodemailer';

app.post('/signup',loginSignupLimiter, async (req, res) => {
 
  try {
    let { password, email, username } = req.body;
username = username.toLowerCase();
email = email.toLowerCase()

 
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    const isBlockedUser = await Blocklist.findOne({ $or: [{ username }, { email }] });
   
        if (isBlockedUser) {

          return res.status(500).json({ message: 'Your account has been suspended' });
    
        }


    if (existingUser) {
      if (existingUser.username === username) {
        return res.status(400).json({ message: 'Username already taken' });
      }else if(existingUser.email === email){

        return res.status(400).json({ message: 'Email already taken' });
      }

    }



    // Create a new user instance
    const newUser = new User({ username, password, email });

    // Generate a JWT for email verification
    const emailVerificationToken = newUser.generateEmailVerificationToken();

    // Save the user and the email verification token to the database
    newUser.emailVerificationToken = emailVerificationToken;
    await newUser.save();

    req.session.email = email;

  const transporter = nodemailer.createTransport({
    host: process.env.HOST,
    secure: true,
    port: 465,
    auth: {
      user: process.env.USER,
      pass: process.env.PASS
    }
  });

  const mailOptions = {
    from: `Aquafusion <${process.env.USER}>`,
    to: email,
    subject: 'Email Verification',
    html: `
    <div style="color:black;font-family: Helvetica Neue,Helvetica,Arial,Lucida Grande,sans-serif;"> 
    <table class="main" style="font-size:1.1em;max-width: 500px; border-collapse: collapse; border:1px solid #ccc; border-radius: 5px; box-shadow: 0 0 2px #ccc; margin: 0 auto; ">
       <tr>
           <td style="padding: 16px;">
               <h2 class="heading" style="text-align: center; font-size: 20px; font-weight: 600; color: #00A5AD; letter-spacing: 0.8px; margin-bottom: 2em;">
                   <img style="vertical-align: middle;margin-right: 1px; max-width: 24px;" src="https://st.aquafusion.in/favicon.ico" alt="..."> <span style="vertical-align: middle">Aquafusion</span>
               </h2>
               <h4 class="greeting" style="margin-bottom: 0px; font-size: 1.1em;">Hey NurMd,</h4>
               <p class="context" style="opacity: 0.8; line-height: 1.6;">
                   Thanks for registering for an account on Aquafusion! Before we get started, we just need to confirm that this is you. Click below to verify your email address:
               </p>
               <p style="text-align: center; margin-top: 3em;margin-bottom:3em" class="btn-contain">
                   <a class="verify-btn" style="background-color: #00A5AD; border: none; color: white; padding: 10px 20px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px;" href="http://${req.get('host')}/verify-email/${emailVerificationToken}">Verify Email</a>
               </p>
               <p class="info1">This Link will expire in 30 Minutes.</p>
               <p class="line" style="border-bottom: 1px solid #ccc; margin-bottom: 0px;"></p>
               <p class="info1" style="opacity: 0.8; font-size: 14px; margin-top: 1.5em; line-height: 1.4; margin-bottom: 0px;">
                   If you don’t recognize signing up for this, you can safely ignore this email.
               </p>
             
           </td>
       </tr>
   </table>
   <footer style="margin-top:2em;opacity: 0.7; font-size: 0.9em; line-height: 1.5;" class="footer">
   <p style="text-align:center">
       For any assistance, feel free to reach out:
       Email: <a href="mailto:${process.env.USER}">${process.env.USER}</a>, or Contact our <a href="https://st.aquafusion.in/support"> support team.</a>
   </p>
</footer>
   </div>
`
  };

req.session.lastRequestTime = Date.now();

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      req.session.error = true;
      return res.status(500).json({ message: 'Fail to Send Email' });
    }
req.session.error = false;
 res.status(200).json({ message: 'Success' });;
  })

  
 }catch(error) {
    console.error('Error during signup:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/verify-email', (req, res) => {
  let error = req.session.error || false;
  
  res.render('verifyemail',{error:error});

});

app.get('/verify-email/:token', async (req, res) => {
  const { token } = req.params;

  try {
    const user = await User.findOne({ emailVerificationToken: token });

    if (!user) {
      return res.status(404).render('verify-fail');
    }

    if (user.isEmailVerified) {
      return res.render('verify-already');
    }

    if (user.verifyEmailToken(token)) {
      jwt.verify(token,process.env.SECRET); // Replace with your actual secret key

      user.isEmailVerified = true;
      // user.emailVerificationToken = undefined; // Clear the token after verification
      user.expires =  '2999-12-31T18:30:00.000Z';

      await user.save();

      res.render("verify-success");
    } else {
      res.status(400).json({ message: 'Invalid token' });
    }
  } catch (error) {
    console.error('Error verifying email:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/resend-verification-email', async (req, res) => {

  let email = req.session.email;
  if(!email){
    return res.json({status:'error',message:'Email Not Found'});
  }
  let existingUser = await User.findOne({email:email});

  if(!existingUser){
    return res.json({status:'error',message:'Email Not Found'});
  }

  if(existingUser.isEmailVerified){

    return res.json({status:'error',message:'Email Already Verified'});
    
  }
  
  if (req.session.lastRequestTime) {
    const currentTime = Date.now();
    const storedTime = req.session.lastRequestTime;
    const cooldownPeriod = 90000; 
    
    const timeElapsed = currentTime - storedTime;
    
    if (timeElapsed < cooldownPeriod) {
      return res.json({ message: 'cooldown', status: 'error' });
    }
  }
  
  // Only update lastRequestTime if the action can proceed
  req.session.lastRequestTime = Date.now();



let emailVerificationToken = existingUser.emailVerificationToken;
if(!emailVerificationToken){
  emailVerificationToken = existingUser.generateEmailVerificationToken();
  existingUser.emailVerificationToken = emailVerificationToken;
  await existingUser.save();
}
  const transporter = nodemailer.createTransport({
    host: process.env.HOST,
    secure: true,
    port: 465,
    auth: {
      user: process.env.USER,
      pass: process.env.PASS
    }
  });

 
  const mailOptions = {
    from: `Aquafusion <${process.env.USER}>`,
    to: email,
    subject: 'Email Verification',
    html: `
    <div style="color:black;font-family: Helvetica Neue,Helvetica,Arial,Lucida Grande,sans-serif;"> 
    <table class="main" style="font-size:1.1em;max-width: 500px; border-collapse: collapse; border:1px solid #ccc; border-radius: 5px; box-shadow: 0 0 2px #ccc; margin: 0 auto; ">
       <tr>
           <td style="padding: 16px;">
               <h2 class="heading" style="text-align: center; font-size: 20px; font-weight: 600; color: #00A5AD; letter-spacing: 0.8px; margin-bottom: 2em;">
                   <img style="vertical-align: middle;margin-right: 1px; max-width: 24px;" src="https://st.aquafusion.in/favicon.ico" alt="..."> <span style="vertical-align: middle">Aquafusion</span>
               </h2>
               <h4 class="greeting" style="margin-bottom: 0px; font-size: 1.1em;">Hey NurMd,</h4>
               <p class="context" style="opacity: 0.8; line-height: 1.6;">
                   Thanks for registering for an account on Aquafusion! Before we get started, we just need to confirm that this is you. Click below to verify your email address:
               </p>
               <p style="text-align: center; margin-top: 3em;margin-bottom:3em" class="btn-contain">
                   <a class="verify-btn" style="background-color: #00A5AD; border: none; color: white; padding: 10px 20px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px;" href="http://${req.get('host')}/verify-email/${emailVerificationToken}">Verify Email</a>
               </p>
               <p class="info1">This Link will expire in 30 Minutes.</p>
               <p class="line" style="border-bottom: 1px solid #ccc; margin-bottom: 0px;"></p>
               <p class="info1" style="opacity: 0.8; font-size: 14px; margin-top: 1.5em; line-height: 1.4; margin-bottom: 0px;">
                   If you don’t recognize signing up for this, you can safely ignore this email.
               </p>
             
           </td>
       </tr>
   </table>
   <footer style="margin-top:2em;opacity: 0.7; font-size: 0.9em; line-height: 1.5;" class="footer">
   <p style="text-align:center">
       For any assistance, feel free to reach out:
       Email: <a href="mailto:${process.env.USER}">${process.env.USER}</a>, or Contact our <a href="https://st.aquafusion.in/support"> support team.</a>
   </p>
</footer>
   </div>
`
  };

 req.session.lastRequestTime = Date.now();

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      return res.json({status:'error',message:'Failed to Send Email'});
    }

    res.json({status:'success',message:'Email sent successfully'});
  })


});

app.get('/forgot-password',(req,res)=>{
  res.render('reset-password')
})

app.post('/forgot-password',loginSignupLimiter,async(req,res)=>{
  
  const { email } = req.body;
  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

  if (!email || !email.match(emailRegex)) {
    res.status(400).json({ msg: 'Provided email is invalid' });
    return;
  }
try{
  const user = await User.findOne({ email });

  if (!user) {
  res.json({status:'success'});

  } else {
    // Generate a JWT token for the password reset
    const secretKey = process.env.SECRET; 
    const resetToken = jwt.sign({ email }, secretKey, { expiresIn: '30m' });

  
    user.resetPasswordToken = resetToken;
 
    await user.save();

    
  
    const transporter = nodemailer.createTransport({
    host: process.env.HOST,
    secure: true,
    port: 465,
    auth: {
      user: process.env.USER,
      pass: process.env.PASS
    }
    });

    const mailOptions = {
      from: `Aquafusion <${process.env.USER}>`,
      to: email,
      subject: 'Password Reset',
      html: `
      <div style="color:black;font-family: Helvetica Neue,Helvetica,Arial,Lucida Grande,sans-serif;"> 
      <table class="main" style="font-size:1.1em;max-width: 500px; border-collapse: collapse; border:1px solid #ccc; border-radius: 5px; box-shadow: 0 0 2px #ccc; margin: 0 auto; ">
         <tr>
             <td style="padding: 16px;">
                 <h3 class="heading" style="text-align: center;font-size: 20px; font-weight: 600; color: #00A5AD; letter-spacing: 0.8px; margin-bottom: 2em;">
                     <img style="vertical-align: middle;margin-right: 1px; max-width: 24px;" src="https://st.aquafusion.in/favicon.ico" alt="..."> <span style="vertical-align: middle">Aquafusion</span>
                 </h3>
                 <h4 class="greeting" style="margin-bottom: 0px; font-size: 1em;">Reset your password!</h4>
                 <p class="context" style="opacity: 0.9; line-height: 1.6;color:black">
                  You are receiving this because you (or someone else) requested to reset your password. Click the following to reset your password.
              </p>
                 <p style="text-align: center; margin-top: 3em;margin-bottom:3em" class="btn-contain">
                     <a class="verify-btn" style="background-color: #00A5AD; border: none; color: white; padding: 10px 20px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px;" href="http://${req.get('host')}/forgot-password/${resetToken}">Reset Password</a>
                 </p>
                 <p class="info1">This Link will expire in 30 Minutes.</p>
                 <p class="line" style="border-bottom: 1px solid #ccc; margin-bottom: 0px;"></p>
                 <p class="info1" style="opacity: 0.8; font-size: 14px; margin-top: 1.5em; line-height: 1.4; margin-bottom: 0px;">
                     If you don’t recognize this, you can safely ignore this email.
                 </p>
               
             </td>
         </tr>
     </table>
     <footer style="margin-top:2em;opacity: 0.7; font-size: 0.9em; line-height: 1.5;" class="footer">
     <p style="text-align:center">
         For any assistance, feel free to reach out:
         Email: <a href="mailto:${process.env.USER}">${process.env.USER}</a>, or Contact our <a href="https://st.aquafusion.in/support"> support team.</a>
     </p>
  </footer>
     </div>
  `
    };

    transporter.sendMail(mailOptions, (err) => {
      if (err) {
    
        res.status(500).json({status:'failure'});
        console.log(err)
      } else { 
        res.json({status:'success'});
   
      }
    });
  }
}catch(err){
  res.status(500).json({status:'failure'});
}
 
})

app.get('/forgot-password/:token',(req,res)=>{
  
  const token = req.params.token; 
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
let email;
  jwt.verify(token, process.env.SECRET, (err, decoded) => {
    if (err) {
      return res.render('resetpassfailed');
    }
   email = decoded.email;
   
res.render('passwordchange',{email:email,token:token})
  });



})   

app.post('/forgot-password/:token',async(req,res)=>{
  
  const token = req.params.token; 
  const {text , password} = req.body;
const password1 = text===password?text:null;

if(!password1){
  return res.status(401).json({ message: 'password does not match or empty' });
}
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = await jwt.verify(token, process.env.SECRET);
    const email = decoded.email;

    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.password = password1;
    await user.save();

    res.render('passwordsuccess.ejs')
    
  } catch (err) {
    res.render('resetpassfailed');
  }


}) 


const authMiddleware = async (req, res, next) => {

  if (req.session && req.session.user) {

      next();

  } else {
    res.redirect('/login');
  }
};


app.use(authMiddleware);


app.get("/logout", (req, res) => {
try{
  req.session.user = null;
  req.session.save();

  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
      return res.status(500).json({ msg: 'Internal Server error' });
    }
 
    // The session should be destroyed at this point
    res.redirect('/login');
  });
}catch(err){
  console.log(err);
  return res.status(500).json({ msg: 'Internal Server error' });
}


});



// Route to initiate the SSE connection for the authenticated user
app.get('/data-updates', (req, res) => {

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  // Extract the user ID from the session
  const userId = req.session.user.userId;

  // Ensure the user is authenticated
  if (!userId) {
    res.status(401).end();
    return;
  }

  // Start the change stream with a filter for the user ID
  const changeStream = Text.watch();
 
  // Listen for change events
  changeStream.on('change', (change) => {
 
    const data = JSON.stringify(change);
    res.write(`data: ${data}\n\n`);
   
  });

  // Handle SSE client disconnect
  req.on('close', () => {
    changeStream.close();
    res.end();
  });
});


app.get("/", (req, res) => {
  let darkmode = false;
  req.cookies.darkmode === "true" ? (darkmode = true) : (darkmode = false); 
  res.render("index", { darkmode: darkmode });
 
});



app.get("/gettext", async (req, res, next) => {

    if(!req.session.user.userId){
      return res.status(400).json({ msg: "Bad request" })
    }
    let userid = req.session.user.userId;
  try {

    let text;
    if (req.query.value == `!`) {
      text = await Text.find({user: userid}).sort({ pin: -1, created: -1 });
    } else {
      text = await Text.find({  user: userid ,hidden: false }).sort({ pin: -1, created: -1 });
    }

    const newText = [];
    text.forEach((item) => {
      let newItem = {
        _id: item._id,
        text: item.text,
        important: item.important,
        pin: item.pin,
        hidden: item.hidden,
      }; // create a copy of the item to modify its properties

      let itemHour = dayjs(item.created.toString()).utc().local().hour();
      let itemMinute = dayjs(item.created.toString()).utc().local().minute();
      let itemDay = dayjs(item.created.toString()).utc().local().date();
      let itemMonth = dayjs(item.created.toString()).utc().local().month();
      let itemYear = dayjs(item.created.toString()).utc().local().year();
      let currentHour = dayjs().local().hour();
      let currentMinute = dayjs().local().minute();
      let currentDay = dayjs().local().date();
      let currentMonth = dayjs().local().month();
      let currentYear = dayjs().local().year();
      if (
        itemYear === currentYear &&
        itemMonth === currentMonth &&
        itemDay === currentDay &&
        itemHour === currentHour &&
        itemMinute === currentMinute
      ) {
        newItem.created = "Just now";
      } else if (
        itemYear === currentYear &&
        itemMonth === currentMonth &&
        itemDay === currentDay &&
        itemHour === currentHour
      ) {
        newItem.created = `${currentMinute - itemMinute} min. ago`;
      } else if (
        itemYear === currentYear &&
        itemMonth === currentMonth &&
        itemDay === currentDay
      ) {
        newItem.created = `${currentHour - itemHour} hours ago`;
      } else if (itemYear === currentYear && itemMonth === currentMonth) {
        newItem.created = `${currentDay - itemDay} days ago`;
      } else if (itemYear === currentYear) {
        newItem.created = `${currentMonth - itemMonth} months ago`;
      } else if (itemYear !== currentYear) {
        newItem.created = `${currentYear - itemYear} years ago`;
      }
      newText.push(newItem); // add the updated item to the new array
    });

    res.json(newText); // send the new array as the response
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});



app.post("/addtext", async (req, res, next) => {

  if(!req.session.user.userId){
    return res.status(400).json({ msg: "Bad request" })
  }
  let userid = req.session.user.userId;
  try {
    req.body.user = req.session.user.userId;
    if (!req.body.text ) {
      return res.status(400).json({ msg: "Please enter text" });
      
    }else if(req.body.text.includes('/n')){
     let isValid = req.body.text.split('/n').filter(item => item.trim() !== '');
      if(isValid.length == 0){
        return res.status(400).json({ msg: "Please enter text" });
      }
    }
   
let text1 = req.body.text.trim();
    if (text1 == `!` ) {
     
      try { 
        res.json({ status: "success", secret: `!` });
      } catch (err) {
        res.status(500).json({ msg: "Server error" });
      }
      return;
    } else if (text1.startsWith("!=")&&text1.length>2) {
  
      let text = req.body.text.replace(`!=`, "");
      req.body.text = text;
      req.body.hidden = true;
      req.body.important=true;
    }else if(req.body.text == `!removehidden`){
      let text = await Text.deleteMany({user:userid,hidden:true});
    res.json(text);
    return;
    }else if(req.body.text == `!restore`){
      let backuptext = await backupText.find({user:userid});
      backuptext.forEach(async(eachtext)=>{
         delete eachtext.createdAt;
        
        const uptext = new Text({
          text:eachtext.text,
          important:true,
          user:userid
        });
         await uptext.save();
      })
      
      res.json(backuptext);
      return;
    }else if(req.body.text == `!removebackups`){
       await backupText.deleteMany({user:userid});
      res.json({success:"backups removed"});
      return;
    }else if(req.body.text == `!commands`){
      const text = new Text({text:`
      
   - !commands Overview of all commands   - 
    - !removehidden Remove all hidden notes   -
    - !restore Restore all notes from backup   -
    - !removebackups Remove all backups   -
    - !removeall Remove all notes   -
  

      `,
      user:userid
    });
      await text.save();
     return res.json(text);
    }
    let text;
    let textobjectids;
    if(req.body.text.includes('/n')){
     text = req.body.text.split('/n').filter(item => item.trim() !== '').map((item)=>{
     return {text:item.trim(),user:req.session.user.userId}
    });
   
     textobjectids = await Text.insertMany(text);
     textobjectids = textobjectids.map(item=>item._id) ;

      await User.findByIdAndUpdate(
        req.body.user,
        { $push: { texts: { $each:  textobjectids } } });
    }else{
      
      

     text = new Text(req.body);
    
    await text.save();

   await User.findByIdAndUpdate(
      req.body.user,
      { $push: { texts:text._id } }
    );
    }
    res.json(text);
    if (req.body.text.includes('/n')) {
      backupText.insertMany(text)
        .then((insertedBackups) => {
          User.findByIdAndUpdate(
            req.body.user,
            { $push: { backups: { $each: insertedBackups.map(backup => backup._id) } } }
          )
          .catch((updateErr) => {
            console.error('Error updating user with backups:', updateErr);
          });
        })
        .catch((backupErr) => {
          console.error('Error inserting backups:', backupErr);
        });
    } else {
      const backuptext = new backupText(req.body); 
    
      backuptext.save()
        .then((savedBackup) => {
          User.findByIdAndUpdate(
            req.body.user,
            { $push: { backups: savedBackup._id } }
          )
          .catch((updateErr) => {
            console.error('Error updating user with backup:', updateErr);
          });
        })
        .catch((saveErr) => {
          console.error('Error saving backup:', saveErr);
        });
    }
    
   
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
    console.log(err)
  }
});

app.get("/deletetext", async (req, res, next) => {

    if(!req.session.user.userId){
      return res.status(400).json({ msg: "Bad request" })
    }
    let userid = req.session.user.userId;
  try {
    const text = await Text.deleteMany({user:userid,hidden:false});

    res.json(text);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

app.post("/deleteone", async (req, res, next) => {

  if(!req.session.user.userId){
    return res.status(400).json({ msg: "Bad request" })
  }
  let userid = req.session.user.userId;
  try {
    const text = await Text.findOneAndDelete({ _id: req.body.id, user: userid });
    res.json(text);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
    console.log(err);
  }
});
app.post("/important", async (req, res, next) => {

  if(!req.session.user.userId){
    return res.status(400).json({ msg: "Bad request" })
  }
  let userid = req.session.user.userId;
  try {
    let text = await Text.findOne({ _id: req.body.id, user: userid });
    if (text.important) {
      text = await Text.findByIdAndUpdate(
        req.body.id,
        { important: false },
        { new: true }
      );
      res.json(text);
    } else {
      text = await Text.findByIdAndUpdate(
        req.body.id,
        { important: true },
        { new: true }
      );
      res.json(text);
    }
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});
app.post("/pintop", async (req, res, next) => {
  if(!req.session.user.userId){
    return res.status(400).json({ msg: "Bad request" })
  }
  let userid = req.session.user.userId;
  try {
    let item = await Text.findOne({ _id: req.body.id, user: userid });

    if (item.pin) {
      let response = await Text.findByIdAndUpdate(
        req.body.id,
        { pin: false },
        { new: true }
      );

      res.json(response);
    } else {
      let response = await Text.findByIdAndUpdate(
        req.body.id,
        { pin: true, created: Date.now() },
        { new: true }
      );

      res.json(response);
    }
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

app.post('/edit',async(req,res)=>{
  if(!req.session.user.userId){
    return res.status(400).json({ msg: "Bad request" })
  }
 let userId = req.session.user.userId;
  try{

  if(!req.body.text){

    return res.status(400).json({ msg: "Please enter text" });

  }
    let response = await Text.findOneAndUpdate({_id:req.body.id,user:userId},{text:req.body.text,created:Date.now()},{new:true});
    res.json(response);
 
  }catch(err){
    res.status(500).json({ msg: "Server error" });
  }

});


app.use((req, res, next) => {
  res.status(404).render('404'); // Render a 404 page or send a custom response
});


app.use((err, req, res, next) => {

  if (err && err.name === 'RateLimitExceededError') {
    res.status(429).render('toomanyattempts');
  } else {
 
    if (err.message && err.message.includes('Unable to find the session to touch')) {
      // Handle the specific session-related error
      console.error('Session error:', err);
 
    } else {
      // Handle other errors
      console.error('Unhandled error:', err);
      res.status(500).render('500');
      
    }

  }
});
