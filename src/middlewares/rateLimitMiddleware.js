import rateLimit from 'express-rate-limit';
const loginSignupLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // maximum number of requests allowed per hour
  message: 'Too many login/signup attempts. Please try again later.', // custom error message
  handler: (req, res, next) => {
    // Custom handler to call next with RateLimitExceededError
    const rateLimitError = new Error('RateLimitExceededError');
    rateLimitError.name = 'RateLimitExceededError';
    next(rateLimitError);
  },
});

export default loginSignupLimiter;