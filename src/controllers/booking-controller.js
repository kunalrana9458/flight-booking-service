const { StatusCodes } = require('http-status-codes')
const {BookingService} = require('../services')
const {ErrorResponse,SuccessResponse} = require('../utils/common')

const inMemDb = {}

async function createBooking(req,res){
    try {
        const result = await BookingService.createBooking({
            flightId:req.body.flightId,
            userId: req.body.userId,
            noOfSeats: req.body.noOfSeats
        })
        SuccessResponse.data = result
        return res 
                 .status(StatusCodes.OK)
                 .json(SuccessResponse)
    } catch (error) {
        console.log(error)
        ErrorResponse.error = error
        return res
                 .status(error.statusCode)
                 .json(ErrorResponse)
    }
}

async function makePayment(req,res){
    
    try {
        const idempotencyKey = req.headers['x-idempotency-key']
        if(!idempotencyKey){
            return res
                     .status(StatusCodes.BAD_REQUEST)
                     .json({message:'Idempotency Key is Missing'})
        }
    if(inMemDb[idempotencyKey]){
        return res
                 .status(StatusCodes.BAD_REQUEST)
                 .json({message:'Cannot retry on a Successfull payment'})
    }
        const result = await BookingService.makePayment({
            totalCost : req.body.totalCost,
            userId : req.body.userId,
            bookingId : req.body.bookingId
        })
        inMemDb[idempotencyKey] = idempotencyKey
        SuccessResponse.data = result
        return res 
                 .status(StatusCodes.OK)
                 .json(SuccessResponse)
    } catch (error) {
        console.log(error)
        ErrorResponse.error = error
        return res
                 .status(error.statusCode)
                 .json(ErrorResponse)
    }
}

async function userBookingHistory(req,res){
    try {
        const userId = req.body.userId
        const result = await BookingService.userBookingHistory(userId)
        SuccessResponse.data = result
        return res
                 .status(StatusCodes.OK)
                 .json(SuccessResponse)
    } catch (error) {
        return res
                 .status(error.statusCode)
                 .json(ErrorResponse)
    }
}

module.exports = {
    createBooking,
    makePayment,
    userBookingHistory
}