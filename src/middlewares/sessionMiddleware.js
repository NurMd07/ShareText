import session from 'express-session';
import dotenv from 'dotenv';
dotenv.config();

let isSecure = process.env.Environment ==='production'?true:false;

const sessionMiddleware = (store)=>{
return session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 14 , // Session will expire in 7 days 
      secure: isSecure, // Set it to true if you're using HTTPS
      httpOnly: true,
      sameSite: 'lax'
    }
  });

}

export default sessionMiddleware;