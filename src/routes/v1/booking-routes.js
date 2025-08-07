const express = require('express')
const router = express.Router()
const {BookingController} = require('../../controllers')
const {RateLimiter} = require('../../middlewares')

router.post(
    '/',
    RateLimiter.createBookingLimiter,
    BookingController.createBooking
)

router.post(
    '/payment',
    RateLimiter.paymentLimiter,
    BookingController.makePayment
)

module.exports = router