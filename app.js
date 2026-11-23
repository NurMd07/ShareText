import express from "express";
const app = express();

import dotenv from "dotenv";
dotenv.config();

import jwt from "jsonwebtoken";
import mongoose from "mongoose";

import User from "./models/user.js";
import Text from "./models/text.js";
import Blocklist from "./models/blocklist.js";

import backupText from "./models/backup.js";
import dayjs from "dayjs";

import advancedFormat from "dayjs/plugin/utc.js"; // load on demand
import cookieParser from "cookie-parser";

//import ratelimit and cron jobs
import loginSignupLimiter from "./src/middlewares/rateLimitMiddleware.js";
import "./src/utils/cronJobs.js";

dayjs.extend(advancedFormat); // use plugin

// path module and config
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

import * as fs from "fs";

//import startBox
import startBox from "./src/helpers/startBox.js";

//connect to db and start server
import connectToDb from "./src/config/dbConnect.js";

connectToDb()
  .then(() => {
    //start server with startbox
    app.listen(process.env.PORT, () => {
      console.log(startBox);
    });
  })
  .catch((err) => {
    console.log(err, "error connecting to db");
  });

let trustproxy = process.env.Environment === "production" ? 1 : 0;

app.set("trust proxy", trustproxy);

//import mongoStore which used to save session data
import store from "./src/config/mongoStore.js";

store.on("error", (error) => {
  console.log(error);
});

//import session middleware and use it
import sessionMiddleware from "./src/middlewares/sessionMiddleware.js";

app.use(sessionMiddleware(store));

app.use(cookieParser());

app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));

app.get("/support", async (req, res) => {
  res.render("contactus", { email: process.env.SUPPORT || null });
});


app.post("/support", loginSignupLimiter, async (req, res) => {
  try {
    let isEmpty = (obj) => Object.keys(obj).length === 0;

    if (isEmpty(req.body)) {
      res.status(400).send("BAD REQUEST: Missing required fields");
      return;
    } else {
      let { name, email, subject, message } = req.body;
      if (!name || !email || !subject || !message) {
        res.status(400).send("BAD REQUEST: Missing required fields");
        return;
      }

      if (name.length < 5 || name.length > 50) {
        res
          .status(400)
          .send("BAD REQUEST: Name does not match required criteria");
        return;
      } else if (email.length < 7 || email.length > 50) {
        res
          .status(400)
          .send("BAD REQUEST: Email does not match required criteria");
        return;
      } else if (subject.length < 5 || subject.length > 200) {
        res
          .status(400)
          .send("BAD REQUEST: Subject does not match required criteria");
        return;
      } else if (message.length < 10 || message.length > 500) {
        res
          .status(400)
          .send("BAD REQUEST: Message does not match required criteria");
        return;
      }
    }
    res.send("OK");

    const filepath = path.join(__dirname, "contactdata.json");

    // Reading from the input file
    fs.readFile(filepath, "utf8", (readErr, data) => {
      if (readErr) {
        if (readErr.code === "ENOENT") {
          console.error("Error: Input file not found.");
          data = "[]";
        } else {
          console.error("Error reading the input file:", readErr);
          return;
        }
      }

      let contactdata = req.body;
      if (!data) {
        data = "[]";
      }
      data = JSON.parse(data);
      data.push(req.body);
      // Writing to the output file
      fs.writeFile(
        filepath,
        JSON.stringify(data, null, 2),
        "utf8",
        (writeErr) => {
          if (writeErr) {
            console.error("Error writing to the output file:", writeErr);
            return;
          }

          console.log("File write successful!");
        }
      );
    });
  } catch (e) {
    console.log(e);
    res.send("Something went wrong!");
  }
});

app.get("/login", (req, res) => {
  const errorMessage = req.session.errorMessage || "";
  req.session.errorMessage = "";

  if (req.session.user) {
    res.redirect("/");
    return;
  }

  res.render("login", { error: errorMessage });
});

app.get("/signup", (req, res) => {
  res.render("signup");
});

app.post("/login", loginSignupLimiter, async (req, res) => {
  try {
    let { password, username } = req.body;
    username = username.toLowerCase();

    if (username.length < 5) {
      req.session.errorMessage = "Username should be minimum of 5 chracters";
      return res.redirect("/login");
    } else if (password.length < 6) {
      req.session.errorMessage = "Password should be more than 6 characters";
      return res.redirect("/login");
    }

    // Check if the provided username or email exists in the database
    const user = await User.findOne({
      $or: [{ username }, { email: username }],
    });

    const isBlockedUser = await Blocklist.findOne({
      $or: [{ username }, { email: username }],
    });

    if (isBlockedUser) {
      req.session.errorMessage = "Your account is suspended!";
      return res.redirect("/login");
    }

    if (!user) {
      req.session.errorMessage = "User does not exist!";
      return res.redirect("/login");
    }

    // Compare the provided password with the stored hashed password
    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      req.session.errorMessage = "Invalid username or password!";
      return res.redirect("/login");
    }
    if (!user.isEmailVerified) {
      let error = req.session.error || false;
      req.session.email = user.email;

      return res.render("./Verification/verifyemail.ejs", { error: error });
    }
    // Set the authenticated user in the session
    req.session.user = {
      userId: user._id,
      username: user.username,
    };

    res.redirect("/");
  } catch (error) {
    ``;
    console.error("Error during login:", error);
    // Handle errors appropriately
    res.redirect("/login");
  }
});

import nodemailer from "nodemailer";

function buildVerificationEmail(siteUrl, verificationUrl) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Verify your ShareText email</title>
  </head>
  <body style="margin:0;padding:0;background-color:#f1f5f9;color:#f4f4f4;font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#f1f5f9;">
      <tr>
        <td align="center" style="padding:32px 16px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;max-width:560px;background-color:#171717;border:1px solid #252b35;border-radius:16px;">
            <tr>
              <td style="padding:28px 28px 12px;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                  <tr>
                    <td align="center" valign="middle" width="40" height="40" bgcolor="#19304a" style="width:40px;height:40px;padding:6px;border-radius:12px;background-color:#19304a;">
                      <img src="${siteUrl}/images/copy.png" width="28" height="28" alt="" style="display:block;width:28px;height:28px;border:0;">
                    </td>
                    <td valign="middle" style="padding-left:12px;">
                      <div style="color:#f4f4f4;font-size:20px;font-weight:700;letter-spacing:-0.4px;">Share<span style="color:#70b7ff;">Text</span></div>
                      <div style="margin-top:4px;color:#9da6b2;font-size:10px;font-weight:700;letter-spacing:1.2px;">ACCOUNT SECURITY</div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:20px 28px 8px;">
                <p style="margin:0 0 10px;color:#70b7ff;font-size:11px;font-weight:700;letter-spacing:1.3px;">EMAIL VERIFICATION</p>
                <h1 style="margin:0 0 14px;color:#f4f4f4;font-size:26px;line-height:1.25;font-weight:700;">Confirm your email</h1>
                <p style="margin:0;color:#c5cbd3;font-size:15px;line-height:1.7;">Thanks for signing up for ShareText. Confirm this email address to finish setting up your account.</p>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding:24px 28px;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                  <tr>
                    <td align="center" bgcolor="#70b7ff" style="border-radius:8px;">
                      <a href="${verificationUrl}" style="display:inline-block;padding:14px 26px;border-radius:8px;color:#1b2633;font-size:15px;font-weight:700;line-height:20px;text-decoration:none;">Verify email address</a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:0 28px 28px;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#202327;border:1px solid #343a40;border-radius:10px;">
                  <tr>
                    <td style="padding:14px 16px;">
                      <p style="margin:0 0 5px;color:#f4f4f4;font-size:14px;font-weight:700;">This link expires in 30 minutes</p>
                      <p style="margin:0;color:#aeb7c2;font-size:13px;line-height:1.55;">Verify your email address to finish setting up your ShareText account.</p>
                    </td>
                  </tr>
                </table>
                <p style="margin:20px 0 6px;color:#c5cbd3;font-size:13px;line-height:1.6;">If the button does not work, copy and paste this address into your browser:</p>
                <p style="margin:0;word-break:break-all;font-size:12px;line-height:1.6;"><a href="${verificationUrl}" style="color:#84c5ff;text-decoration:underline;">${verificationUrl}</a></p>
                <p style="margin:20px 0 0;padding-top:16px;border-top:1px solid #343a40;color:#aeb7c2;font-size:13px;line-height:1.6;">If you did not create a ShareText account, you can safely ignore this email.</p>
              </td>
            </tr>
          </table>
          <p style="margin:18px 0 0;color:#64748b;font-size:12px;line-height:1.6;text-align:center;">Need help? <a href="${siteUrl}/support" style="color:#1769e0;text-decoration:underline;">Contact ShareText support</a>.</p>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function buildAccountDeletionEmail(siteUrl, confirmationUrl) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Confirm account deletion</title>
  </head>
  <body style="margin:0;padding:0;background-color:#f1f5f9;color:#f4f4f4;font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#f1f5f9;">
      <tr>
        <td align="center" style="padding:32px 16px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;max-width:560px;background-color:#171717;border:1px solid #252b35;border-radius:16px;">
            <tr>
              <td style="padding:28px 28px 12px;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                  <tr>
                    <td align="center" valign="middle" width="40" height="40" bgcolor="#19304a" style="width:40px;height:40px;padding:6px;border-radius:12px;background-color:#19304a;">
                      <img src="${siteUrl}/images/copy.png" width="28" height="28" alt="" style="display:block;width:28px;height:28px;border:0;">
                    </td>
                    <td valign="middle" style="padding-left:12px;">
                      <div style="color:#f4f4f4;font-size:20px;font-weight:700;">Share<span style="color:#70b7ff;">Text</span></div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:20px 28px 8px;">
                <p style="margin:0 0 10px;color:#fda4af;font-size:11px;font-weight:700;letter-spacing:1.3px;">ACCOUNT DELETION</p>
                <h1 style="margin:0 0 14px;color:#f4f4f4;font-size:26px;line-height:1.25;font-weight:700;">Confirm account deletion</h1>
                <p style="margin:0;color:#c5cbd3;font-size:15px;line-height:1.7;">We received a request to permanently delete your ShareText account, saved text, and backups. Open the link below within 30 minutes to complete the deletion.</p>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding:24px 28px;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                  <tr>
                    <td align="center" bgcolor="#dc3545" style="border-radius:8px;">
                      <a href="${confirmationUrl}" style="display:inline-block;padding:14px 26px;border-radius:8px;color:#ffffff;font-size:15px;font-weight:700;line-height:20px;text-decoration:none;">Delete my account</a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:0 28px 28px;">
                <p style="margin:0 0 6px;color:#c5cbd3;font-size:13px;line-height:1.6;">If the button does not work, copy and paste this address into your browser:</p>
                <p style="margin:0;word-break:break-all;font-size:12px;line-height:1.6;"><a href="${confirmationUrl}" style="color:#84c5ff;text-decoration:underline;">${confirmationUrl}</a></p>
                <p style="margin:20px 0 0;padding-top:16px;border-top:1px solid #343a40;color:#aeb7c2;font-size:13px;line-height:1.6;">If you did not request this, ignore this email. Your account will remain active. <a href="${siteUrl}/support" style="color:#84c5ff;text-decoration:underline;">Contact support</a>.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

app.post("/signup", loginSignupLimiter, async (req, res) => {
  try {
    let { password, email, username } = req.body;
    username = username.toLowerCase();
    email = email.toLowerCase();

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    const isBlockedUser = await Blocklist.findOne({
      $or: [{ username }, { email }],
    });

    if (isBlockedUser) {
      return res
        .status(500)
        .json({ message: "Your account has been suspended" });
    }

    if (existingUser) {
      if (existingUser.username === username) {
        return res.status(400).json({ message: "Username already taken" });
      } else if (existingUser.email === email) {
        return res.status(400).json({ message: "Email already taken" });
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
        pass: process.env.PASS,
      },
    });

    const siteUrl = `${req.protocol}://${req.get("host")}`;
    const verificationUrl = `${siteUrl}/verify-email/${emailVerificationToken}`;
    const mailOptions = {
      from: `ShareText <${process.env.USER}>`,
      to: email,
      subject: "Verify your ShareText email",
      html: buildVerificationEmail(siteUrl, verificationUrl),
    };

    req.session.lastRequestTime = Date.now();

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        req.session.error = true;
        return res.status(500).json({ message: "Fail to Send Email" });
      }
      req.session.error = false;
      res.status(200).json({ message: "Success" });
    });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/verify-email", (req, res) => {
  let error = req.session.error || false;

  res.render("./Verification/verifyemail.ejs", { error: error });
});

app.get("/verify-email/:token", async (req, res) => {
  const { token } = req.params;

  try {
    const user = await User.findOne({ emailVerificationToken: token });

    if (!user) {
      return res.status(401).render("./Verification/verify-fail.ejs");
    }

    if (user.isEmailVerified) {
      return res.render("./Verification/verify-already.ejs");
    }

    if (user.verifyEmailToken(token)) {
      jwt.verify(token, process.env.SECRET);
      user.isEmailVerified = true;

      // user.emailVerificationToken = undefined; // Clear the token after verification
      user.expires = "2999-12-31T18:30:00.000Z";
      let text = new Text({
        text: "📲 Install ShareText as an app for the best experience from Address bar or Settings menu!",
        user: user._id,
        important: true,
        pin: true,
      });
      if (!user.texts || user.texts.length === 0) {
        // Initialize the texts array if not present
        user.texts = [];
      }
      await text.save();
      user.texts.push(text._id);

      await user.save();

      res.render("./Verification/verify-success.ejs");
    } else {
      res.status(400).json({ message: "Invalid token" });
    }
  } catch (error) {
    console.error("Error verifying email:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/resend-verification-email", async (req, res) => {
  let email = req.session.email;
  if (!email) {
    return res.json({ status: "error", message: "Email Not Found" });
  }
  let existingUser = await User.findOne({ email: email });

  if (!existingUser) {
    return res.json({ status: "error", message: "Email Not Found" });
  }

  if (existingUser.isEmailVerified) {
    return res.json({ status: "error", message: "Email Already Verified" });
  }

  if (req.session.lastRequestTime) {
    const currentTime = Date.now();
    const storedTime = req.session.lastRequestTime;
    const cooldownPeriod = 90000;

    const timeElapsed = currentTime - storedTime;

    if (timeElapsed < cooldownPeriod) {
      return res.json({ message: "cooldown", status: "error" });
    }
  }

  // Only update lastRequestTime if the action can proceed
  req.session.lastRequestTime = Date.now();

  let emailVerificationToken = existingUser.emailVerificationToken;
  if (!emailVerificationToken) {
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
      pass: process.env.PASS,
    },
  });

  const siteUrl = `${req.protocol}://${req.get("host")}`;
  const verificationUrl = `${siteUrl}/verify-email/${emailVerificationToken}`;
  const mailOptions = {
    from: `ShareText <${process.env.USER}>`,
    to: email,
    subject: "Verify your ShareText email",
    html: buildVerificationEmail(siteUrl, verificationUrl),
  };

  req.session.lastRequestTime = Date.now();
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
      return res.json({ status: "error", message: "Failed to Send Email" });
    }

    res.json({ status: "success", message: "Email sent successfully" });
  });
});

app.get("/forgot-password", (req, res) => {
  res.render("./Password/reset-password.ejs");
});

app.post("/forgot-password", loginSignupLimiter, async (req, res) => {
  const { email } = req.body;
  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

  if (!email || !email.match(emailRegex)) {
    res.status(400).json({ msg: "Provided email is invalid" });
    return;
  }
  try {
    const user = await User.findOne({ email });

    if (!user) {
      res.json({ status: "success" });
    } else {
      // Generate a JWT token for the password reset
      const secretKey = process.env.SECRET;
      const resetToken = jwt.sign({ email }, secretKey, { expiresIn: "30m" });

      user.resetPasswordToken = resetToken;

      await user.save();

      const siteUrl = `${req.protocol}://${req.get("host")}`;
      const resetUrl = `${siteUrl}/forgot-password/${resetToken}`;

      const transporter = nodemailer.createTransport({
        host: process.env.HOST,
        secure: true,
        port: 465,
        auth: {
          user: process.env.USER,
          pass: process.env.PASS,
        },
      });

      const mailOptions = {
        from: `ShareText <${process.env.USER}>`,
        to: email,
        subject: "Reset your ShareText password",
        html: `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Reset your ShareText password</title>
  </head>
  <body style="margin:0;padding:0;background-color:#f1f5f9;color:#f4f4f4;font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#f1f5f9;">
      <tr>
        <td align="center" style="padding:32px 16px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;max-width:560px;background-color:#171717;border:1px solid #252b35;border-radius:16px;">
            <tr>
              <td style="padding:28px 28px 12px;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                  <tr>
                    <td align="center" valign="middle" width="40" height="40" bgcolor="#19304a" style="width:40px;height:40px;padding:6px;border-radius:12px;background-color:#19304a;">
                      <img src="${siteUrl}/images/copy.png" width="28" height="28" alt="" style="display:block;width:28px;height:28px;border:0;">
                    </td>
                    <td valign="middle" style="padding-left:12px;">
                      <div style="color:#f4f4f4;font-size:20px;font-weight:700;letter-spacing:-0.4px;">Share<span style="color:#70b7ff;">Text</span></div>
                      <div style="margin-top:4px;color:#9da6b2;font-size:10px;font-weight:700;letter-spacing:1.2px;">ACCOUNT SECURITY</div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:20px 28px 8px;">
                <p style="margin:0 0 10px;color:#70b7ff;font-size:11px;font-weight:700;letter-spacing:1.3px;">PASSWORD RESET</p>
                <h1 style="margin:0 0 14px;color:#f4f4f4;font-size:26px;line-height:1.25;font-weight:700;">Reset your password</h1>
                <p style="margin:0;color:#c5cbd3;font-size:15px;line-height:1.7;">We received a request to reset the password for your ShareText account. If you made this request, use the button below to choose a new password.</p>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding:24px 28px;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                  <tr>
                    <td align="center" bgcolor="#70b7ff" style="border-radius:8px;">
                      <a href="${resetUrl}" style="display:inline-block;padding:14px 26px;border-radius:8px;color:#1b2633;font-size:15px;font-weight:700;line-height:20px;text-decoration:none;">Reset password</a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:0 28px 28px;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#202327;border:1px solid #343a40;border-radius:10px;">
                  <tr>
                    <td style="padding:14px 16px;">
                      <p style="margin:0 0 5px;color:#f4f4f4;font-size:14px;font-weight:700;">This link expires in 30 minutes</p>
                      <p style="margin:0;color:#aeb7c2;font-size:13px;line-height:1.55;">For your security, the link can only be used once.</p>
                    </td>
                  </tr>
                </table>
                <p style="margin:20px 0 6px;color:#c5cbd3;font-size:13px;line-height:1.6;">If the button does not work, copy and paste this address into your browser:</p>
                <p style="margin:0;word-break:break-all;font-size:12px;line-height:1.6;"><a href="${resetUrl}" style="color:#84c5ff;text-decoration:underline;">${resetUrl}</a></p>
                <p style="margin:20px 0 0;padding-top:16px;border-top:1px solid #343a40;color:#aeb7c2;font-size:13px;line-height:1.6;">If you did not request a password reset, you can safely ignore this email. Your password will not change unless you use the link.</p>
              </td>
            </tr>
          </table>
          <p style="margin:18px 0 0;color:#64748b;font-size:12px;line-height:1.6;text-align:center;">Need help? <a href="${siteUrl}/support" style="color:#1769e0;text-decoration:underline;">Contact ShareText support</a>.</p>
        </td>
      </tr>
    </table>
  </body>
</html>`,
      };

      transporter.sendMail(mailOptions, (err) => {
        if (err) {
          res.status(500).json({ status: "failure" });
          console.log(err);
        } else {
          res.json({ status: "success" });
        }
      });
    }
  } catch (err) {
    res.status(500).json({ status: "failure" });
  }
});

app.get("/forgot-password/:token", (req, res) => {
  const token = req.params.token;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  let email;
  jwt.verify(token, process.env.SECRET, (err, decoded) => {
    if (err) {
      return res.render("./Password/resetpassfailed.ejs");
    }
    email = decoded.email;

    res.render("./Password/passwordchange", { email: email, token: token });
  });
});

app.post("/forgot-password/:token", async (req, res) => {
  const token = req.params.token;
  const { text, password } = req.body;
  const password1 = text === password ? text : null;

  if (!password1) {
    return res
      .status(401)
      .json({ message: "password does not match or empty" });
  }
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = await jwt.verify(token, process.env.SECRET);
    const email = decoded.email;

    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.password = password1;
    await user.save();

    res.render("./Password/passwordsuccess.ejs");
  } catch (err) {
    res.render("./Password/resetpassfailed.ejs");
  }
});

app.get("/change-password", (req, res) => {
  res.render("Account/change-password", { feedback: "", feedbackType: "" });
});

app.post("/change-password", loginSignupLimiter, async (req, res) => {
  const body = req.body || {};
  const identifier =
    typeof body.identifier === "string"
      ? body.identifier.trim().toLowerCase()
      : "";
  const currentPassword =
    typeof body.currentPassword === "string" ? body.currentPassword : "";
  const newPassword =
    typeof body.newPassword === "string" ? body.newPassword : "";
  const confirmPassword =
    typeof body.confirmPassword === "string" ? body.confirmPassword : "";
  const renderChangePassword = (feedback, feedbackType = "error", status = 200) =>
    res
      .status(status)
      .render("Account/change-password", { feedback, feedbackType });

  if (
    identifier.length < 5 ||
    currentPassword.length < 6 ||
    newPassword.length < 6 ||
    newPassword !== confirmPassword
  ) {
    return renderChangePassword(
      "Enter valid account details and matching passwords of at least 6 characters.",
      "error",
      400
    );
  }

  try {
    const user = await User.findOne({
      $or: [{ username: identifier }, { email: identifier }],
    });

    if (!user || !(await user.comparePassword(currentPassword))) {
      return renderChangePassword(
        "We couldn’t verify those account details. Check them and try again.",
        "error",
        400
      );
    }

    if (await user.comparePassword(newPassword)) {
      return renderChangePassword(
        "Choose a new password that is different from your current password.",
        "error",
        400
      );
    }

    user.password = newPassword;
    await user.save();

    return renderChangePassword("Your password has been updated.", "success");
  } catch (error) {
    console.error("Error changing account password:", error);
    return renderChangePassword(
      "We couldn’t update your password right now. Please try again later.",
      "error",
      500
    );
  }
});

app.get("/delete-account", (req, res) => {
  res.render("Account/delete-account", { feedback: "" });
});

app.post("/delete-account", loginSignupLimiter, async (req, res) => {
  const body = req.body || {};
  const identifier =
    typeof body.identifier === "string"
      ? body.identifier.trim().toLowerCase()
      : "";
  const password = typeof body.password === "string" ? body.password : "";
  const confirmation =
    typeof body.confirmation === "string" ? body.confirmation.trim() : "";
  const renderDeleteAccount = (feedback, status = 200) =>
    res.status(status).render("Account/delete-account", { feedback });

  if (identifier.length < 5 || password.length < 6 || confirmation !== "DELETE") {
    return renderDeleteAccount(
      "Enter your account details and type DELETE exactly to confirm.",
      400
    );
  }

  try {
    const user = await User.findOne({
      $or: [{ username: identifier }, { email: identifier }],
    });

    if (!user || !(await user.comparePassword(password))) {
      return renderDeleteAccount(
        "We couldn’t verify those account details. Check them and try again.",
        400
      );
    }

    const token = jwt.sign(
      { userId: String(user._id), purpose: "delete-account" },
      process.env.SECRET,
      { expiresIn: "30m" }
    );
    user.deleteAccountToken = token;
    await user.save();

    const siteUrl = `${req.protocol}://${req.get("host")}`;
    const confirmationUrl = `${siteUrl}/delete-account/confirm/${encodeURIComponent(token)}`;
    const transporter = nodemailer.createTransport({
      host: process.env.HOST,
      secure: true,
      port: 465,
      auth: {
        user: process.env.USER,
        pass: process.env.PASS,
      },
    });

    await transporter.sendMail({
      from: `ShareText <${process.env.USER}>`,
      to: user.email,
      subject: "Confirm your ShareText account deletion",
      html: buildAccountDeletionEmail(siteUrl, confirmationUrl),
    });

    return res.render("Account/delete-account-pending");
  } catch (error) {
    console.error("Error requesting account deletion:", error);
    return renderDeleteAccount(
      "We couldn’t send the confirmation email. Please try again later.",
      500
    );
  }
});

app.get("/delete-account/confirm/:token", async (req, res) => {
  const { token } = req.params;
  const renderDeleteAccount = (feedback, status = 400) =>
    res.status(status).render("Account/delete-account", { feedback });

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.SECRET);
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return renderDeleteAccount(
        "This confirmation link is invalid or expired. Please submit your deletion request again."
      );
    }
    console.error("Error verifying account deletion link:", error);
    return renderDeleteAccount(
      "We couldn’t confirm the deletion request. Please try again later.",
      500
    );
  }

  if (
    typeof decoded !== "object" ||
    decoded === null ||
    decoded.purpose !== "delete-account" ||
    typeof decoded.userId !== "string"
  ) {
    return renderDeleteAccount(
      "This confirmation link is invalid or expired. Please submit your deletion request again."
    );
  }

  let deletedUserId = null;
  let mongoSession;

  try {
    mongoSession = await mongoose.startSession();
    await mongoSession.withTransaction(async () => {
      deletedUserId = null;
      const user = await User.findOne({
        _id: decoded.userId,
        deleteAccountToken: token,
      }).session(mongoSession);

      if (!user) {
        return;
      }

      deletedUserId = user._id;
      await Text.deleteMany({ user: user._id }, { session: mongoSession });
      await backupText.deleteMany({ user: user._id }, { session: mongoSession });
      const result = await User.deleteOne(
        { _id: user._id, deleteAccountToken: token },
        { session: mongoSession }
      );

      if (result.deletedCount !== 1) {
        throw new Error("Account was not deleted");
      }
    });
  } catch (error) {
    console.error("Error deleting account after email confirmation:", error);
    return renderDeleteAccount(
      "We couldn’t delete your account right now. Please try again later.",
      500
    );
  } finally {
    if (mongoSession) {
      await mongoSession.endSession();
    }
  }

  if (!deletedUserId) {
    return renderDeleteAccount(
      "This confirmation link is invalid or has already been used. Please submit your deletion request again."
    );
  }

  const renderSuccess = () => res.render("Account/delete-account-success");
  if (String(req.session.user?.userId) === String(deletedUserId)) {
    return req.session.destroy((error) => {
      if (error) {
        console.error("Error ending session after account deletion:", error);
      }
      renderSuccess();
    });
  }

  return renderSuccess();
});

const authMiddleware = async (req, res, next) => {
  if (req.session && req.session.user) {
    next();
  } else {
    res.redirect("/login");
  }
};

app.use(authMiddleware);

app.get("/logout", (req, res) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        console.error("Error destroying session:", err);
        return res.status(500).json({ msg: "Internal Server error" });
      }

      // The session should be destroyed at this point
      res.redirect("/login");
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "Internal Server error" });
  }
});


// Route to initiate the SSE connection for the authenticated user
app.get("/data-updates", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
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
  changeStream.on("change", (change) => {
    const data = JSON.stringify(change);
    res.write(`data: ${data}\n\n`);
  });

  // Handle SSE client disconnect
  res.on("close", () => {
    changeStream.close();
  });
});

app.get("/", (req, res) => {
  let darkmode = false;
  req.cookies.darkmode === "true" ? (darkmode = true) : (darkmode = false);
  res.render("index", { darkmode: darkmode });
});

app.get("/gettext", async (req, res, next) => {
  if (!req.session.user.userId) {
    return res.status(400).json({ msg: "Bad request" });
  }
  let userid = req.session.user.userId;
  try {
    let text;
    if (req.query.value == `!`) {
      text = await Text.find({ user: userid }).sort({
        pin: -1,
        pinnedAt: -1,
        created: -1,
      });
    } else {
      text = await Text.find({ user: userid, hidden: false }).sort({
        pin: -1,
        pinnedAt: -1,
        created: -1,
      });
    }

    const newText = [];
    const now = dayjs();
    text.forEach((item) => {
      let newItem = {
        _id: item._id,
        text: item.text,
        important: item.important,
        restored: Boolean(item.restoredFrom),
        pin: item.pin,
        hidden: item.hidden,
      }; // create a copy of the item to modify its properties

      const createdAt = dayjs(item.created);
      const elapsedMinutes = Math.max(0, now.diff(createdAt, "minute"));
      if (elapsedMinutes === 0) {
        newItem.created = "Just now";
      } else if (elapsedMinutes < 60) {
        newItem.created = `${elapsedMinutes}m ago`;
      } else if (elapsedMinutes < 24 * 60) {
        const hours = Math.floor(elapsedMinutes / 60);
        newItem.created = `${hours}h ago`;
      } else {
        const elapsedMonths = now.diff(createdAt, "month");
        const elapsedYears = now.diff(createdAt, "year");
        if (elapsedMonths >= 12) {
          newItem.created = `${elapsedYears}y ago`;
        } else if (elapsedMonths >= 1) {
          newItem.created = `${elapsedMonths}mo ago`;
        } else {
          newItem.created = `${Math.floor(elapsedMinutes / (24 * 60))}d ago`;
        }
      }
      newText.push(newItem); // add the updated item to the new array
    });

    res.json(newText); // send the new array as the response
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

app.post("/addtext", async (req, res, next) => {

  const userid = req.session?.user?.userId;
  if (!userid) {
    return res.status(400).json({ msg: "Bad request" });
  }
  try {
    if (!req.body.text) {
      return res.status(400).json({ msg: "Please enter text" });
    } else if (req.body.text.includes("+n")) {
      let isValid = req.body.text
        .split("+n")
        .filter((item) => item.trim() !== "");
      if (isValid.length == 0) {
        return res.status(400).json({ msg: "Please enter text" });
      }
    }

    let text1 = req.body.text.trim();
    if (text1 == `!`) {
      try {
        res.json({ status: "success", secret: `!` });
      } catch (err) {
        res.status(500).json({ msg: "Server error" });
      }
      return;
    } else if (text1.startsWith("!=") && text1.length > 2) {
      let text = req.body.text.replace(`!=`, "");
      req.body.text = text;
      req.body.hidden = true;
      req.body.important = true;
    } else if (req.body.text == `!removehidden`) {
      const hiddenTexts = await Text.find({ user: userid, hidden: true })
        .select("_id")
        .lean();
      const result = await Text.deleteMany({ user: userid, hidden: true });
      if (hiddenTexts.length > 0) {
        await User.findByIdAndUpdate(userid, {
          $pull: { texts: { $in: hiddenTexts.map((item) => item._id) } },
        });
      }
      res.json(result);
      return;
    } else if (req.body.text == `!restore`) {
      const backups = await backupText.find({ user: userid }).sort({
        created: 1,
        _id: 1,
      });
      const restoredTextIds = [];
      const backupIds = backups.map((backup) => backup._id);
      const sourceTextIds = backups
        .map((backup) => backup.sourceTextId)
        .filter(Boolean);
      const [existingSourceTexts, existingRestoredTexts] = await Promise.all([
        Text.find({ user: userid, _id: { $in: sourceTextIds } })
          .select("_id")
          .lean(),
        Text.find({ user: userid, restoredFrom: { $in: backupIds } })
          .select("_id restoredFrom")
          .lean(),
      ]);
      const existingSourceIds = new Set(
        existingSourceTexts.map((item) => item._id.toString())
      );
      const restoredByBackupId = new Map(
        existingRestoredTexts.map((item) => [
          item.restoredFrom.toString(),
          item._id,
        ])
      );

      for (const backup of backups) {
        if (
          backup.sourceTextId &&
          existingSourceIds.has(backup.sourceTextId.toString())
        ) {
          restoredTextIds.push(backup.sourceTextId);
          continue;
        }

        let restoredTextId = restoredByBackupId.get(backup._id.toString());
        if (!restoredTextId) {
          try {
            const restoredText = await Text.create({
              text: backup.text,
              important: false,
              user: userid,
              restoredFrom: backup._id,
            });
            restoredTextId = restoredText._id;
          } catch (error) {
            if (error.code !== 11000) {
              throw error;
            }
            const restoredText = await Text.findOne({
              user: userid,
              restoredFrom: backup._id,
            }).select("_id");
            if (!restoredText) {
              throw error;
            }
            restoredTextId = restoredText._id;
          }
        }

        restoredTextIds.push(restoredTextId);
      }

      if (restoredTextIds.length > 0) {
        await User.findByIdAndUpdate(userid, {
          $addToSet: { texts: { $each: restoredTextIds } },
        });
      }

      res.json(
        backups.map((backup) => {
          const item = backup.toObject();
          delete item.createdAt;
          delete item.sourceTextId;
          return item;
        })
      );
      return;
    } else if (req.body.text == `!removebackups`) {
      await backupText.deleteMany({ user: userid });
      await User.findByIdAndUpdate(userid, { $set: { backups: [] } });
      res.json({ success: "backups removed" });
      return;
    } else if (req.body.text == `!commands`) {
      const text = new Text({
        text: `
      
   - !commands Overview of all commands   - 
    - !removehidden Remove all hidden notes   -
    - !restore Restore all notes from backup   -
    - !removebackups Remove all backups   -
    - !removeall Remove all notes   -
  

      `,
        user: userid,
      });
      await text.save();
      return res.json(text);
    }
    let text;
    if (req.body.text.includes("+n")) {
      const textItems = req.body.text
        .split("+n")
        .filter((item) => item.trim() !== "")
        .map((item) => {
          return { text: item.trim(), user: userid };
        });

      text = await Text.insertMany(textItems);
    } else {
      text = new Text({
        text: req.body.text,
        created: req.body.created,
        pinnedAt: req.body.pinnedAt,
        important: req.body.important,
        pin: req.body.pin,
        hidden: req.body.hidden,
        user: userid,
      });
      await text.save();
    }

    const savedTexts = Array.isArray(text) ? text : [text];
    await backupText.insertMany(
      savedTexts.map((item) => ({
        text: item.text,
        created: item.created,
        important: item.important,
        pin: item.pin,
        hidden: item.hidden,
        user: userid,
        sourceTextId: item._id,
      }))
    );
    await User.findByIdAndUpdate(userid, {
      $addToSet: { texts: { $each: savedTexts.map((item) => item._id) } },
    });

    res.json(text);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
    console.error("Error adding text and backup:", err);
  }
});

app.get("/deletetext", async (req, res, next) => {
  const userid = req.session?.user?.userId;
  if (!userid) {
    return res.status(400).json({ msg: "Bad request" });
  }
  try {
    const visibleTexts = await Text.find({ user: userid, hidden: false })
      .select("_id")
      .lean();
    const result = await Text.deleteMany({ user: userid, hidden: false });
    if (visibleTexts.length > 0) {
      await User.findByIdAndUpdate(userid, {
        $pull: { texts: { $in: visibleTexts.map((item) => item._id) } },
      });
    }

    res.json(result);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
    console.error("Error deleting texts:", err);
  }
});

app.post("/deleteone", async (req, res, next) => {
  const userid = req.session?.user?.userId;
  if (!userid) {
    return res.status(400).json({ msg: "Bad request" });
  }
  try {
    const text = await Text.findOneAndDelete({
      _id: req.body.id,
      user: userid,
    });
    if (text) {
      await User.findByIdAndUpdate(userid, {
        $pull: { texts: text._id },
      });
    }
    res.json(text);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
    console.error("Error deleting text:", err);
  }
});
app.post("/important", async (req, res, next) => {
  if (!req.session.user.userId) {
    return res.status(400).json({ msg: "Bad request" });
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
app.post("/hidden", async (req, res) => {
  const userid = req.session?.user?.userId;
  if (!userid) {
    return res.status(400).json({ msg: "Bad request" });
  }
  if (typeof req.body.hidden !== "boolean") {
    return res.status(400).json({ msg: "Invalid hidden state" });
  }

  try {
    const text = await Text.findOneAndUpdate(
      { _id: req.body.id, user: userid },
      { hidden: req.body.hidden },
      { new: true }
    );
    if (!text) {
      return res.status(404).json({ msg: "Text not found" });
    }

    res.json({ hidden: text.hidden });
  } catch (err) {
    console.error("Error updating hidden text:", err);
    res.status(500).json({ msg: "Server error" });
  }
});
app.post("/pintop", async (req, res, next) => {
  if (!req.session.user.userId) {
    return res.status(400).json({ msg: "Bad request" });
  }
  let userid = req.session.user.userId;
  try {
    let item = await Text.findOne({ _id: req.body.id, user: userid });

    if (item.pin) {
      let response = await Text.findByIdAndUpdate(
        req.body.id,
        { pin: false, pinnedAt: null },
        { new: true }
      );

      res.json(response);
    } else {
      let response = await Text.findByIdAndUpdate(
        req.body.id,
        { pin: true, pinnedAt: Date.now() },
        { new: true }
      );

      res.json(response);
    }
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

app.post("/edit", async (req, res) => {
  if (!req.session.user.userId) {
    return res.status(400).json({ msg: "Bad request" });
  }
  let userId = req.session.user.userId;
  try {
    if (!req.body.text) {
      return res.status(400).json({ msg: "Please enter text" });
    }
    let response = await Text.findOneAndUpdate(
      { _id: req.body.id, user: userId },
      {
        $set: { text: req.body.text, created: Date.now() },
        $unset: { restoredFrom: 1 },
      },
      { new: true }
    );
    res.json(response);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

app.use((req, res, next) => {
  res.status(404).render("./Errors/404.ejs"); // Render a 404 page or send a custom response
});

app.use((err, req, res, next) => {
  if (err && err.name === "RateLimitExceededError") {
    res.status(429).render("./Errors/toomanyattempts.ejs");
  } else {
    if (
      err.message &&
      err.message.includes("Unable to find the session to touch")
    ) {
      // Handle the specific session-related error
      console.error("Session error:", err);
    } else {
      // Handle other errors
      console.error("Unhandled error:", err);
      res.status(500).render("./Errors/500.ejs");
    }
  }
});
