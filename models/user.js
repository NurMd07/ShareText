import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();



const { Schema } = mongoose;

const userSchema = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  texts: [{ type: Schema.Types.ObjectId, ref: 'Text' }],
  backups: [{ type: Schema.Types.ObjectId, ref: 'Backup' }],
  createdAt: { type: Date, default: Date.now },
  emailVerificationToken: {type:String},// JWT token for email verification
  isEmailVerified: { type: Boolean, default: false },
  expires: {
    type: Date,
    default: () => new Date(Date.now() + 30 * 60 * 1000) // Default to 30 minutes from now
  },
    resetPasswordToken: String,
 
});
userSchema.index({ expires: 1 }, { expireAfterSeconds: 0 });
// Pre-save middleware to hash and salt the password
userSchema.pre('save', async function (next) {
  try {
    // Only hash the password if it's modified or new
    if (!this.isModified('password')) {
      return next();
    }

    // Generate a salt for password hashing
    const salt = await bcrypt.genSalt(10);

    // Hash the password with the generated salt
    const hashedPassword = await bcrypt.hash(this.password, salt);

    // Replace the plain password with the hashed password
    this.password = hashedPassword;

    next();
  } catch (error) {
    next(error);
  }
});

// Password comparison method
userSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

// Add a method to add session IDs to the user's sessionIDs array
userSchema.methods.addSessionID = function (sessionID) {
  this.sessionIDs.push(sessionID);
};

// Add a method to remove a session ID from the user's sessionIDs array
userSchema.methods.removeSessionID = function (sessionID) {
  this.sessionIDs = this.sessionIDs.filter(id => id !== sessionID);
};

// Generate an email verification token
userSchema.methods.generateEmailVerificationToken = function () {
  return jwt.sign({ email: this.email },process.env.SECRET, { expiresIn: 30*60 });
};

// Verify an email verification token
userSchema.methods.verifyEmailToken = function (token) {
  try {
    const decodedToken = jwt.verify(token,process.env.SECRET);
    return decodedToken.email === this.email;
  } catch (error) {
    return false;
  }
};


export default mongoose.model('User', userSchema);
