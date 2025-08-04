const { StatusCodes } = require('http-status-codes')
const {BookingService} = require('../services')
const {ErrorResponse,SuccessResponse} = require('../utils/common')

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
    console.log('Inside Controller')
    try {
        const result = await BookingService.makePayment({
            totalCost : req.body.totalCost,
            userId : req.body.userId,
            bookingId : req.body.bookingId
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


module.exports = {
    createBooking,
    makePayment
}