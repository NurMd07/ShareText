import cron  from 'node-cron';
import loginSignupLimiter  from '../middlewares/rateLimitMiddleware.js';

cron.schedule('0 0 * * *', () => {
    loginSignupLimiter.resetKey();
    console.log('Rate limit memory cleared');
  });