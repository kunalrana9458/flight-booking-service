const rateLimiter = require("express-rate-limit");

const createBookingLimiter = rateLimiter({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 5, // limit each IP to 5 booking attempts
  message: "Too many booking attempts. Please try again after 10 minutes.",
  standardHeaders: true,
  legacyHeaders: false,
});

const paymentLimiter = rateLimiter({
  windowMs: 1 * 60 * 1000,  // 1 minute
  max: 5,                   // allow 5 payment attempts per minute
  message: 'Too many payment attempts, please wait a minute.',
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  createBookingLimiter,
  paymentLimiter
};
