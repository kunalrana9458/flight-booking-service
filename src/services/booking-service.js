const axios = require("axios");

const { BookingRepository } = require("../repositories");
const { ServerConfig } = require("../config");

const db = require("../models");
const { StatusCodes } = require("http-status-codes");
const AppError = require("../utils/errors/app-error");

const {Enums} = require('../utils/common')
const {INITIATED,CANCELLED,BOOKED,PENDING} = Enums.BOOKING_STATUS

const bookingRepository = new BookingRepository()

async function createBooking(data) {
    const transaction = await db.sequelize.transaction()
    try {
        const flight = await axios.get(`${ServerConfig.FLIGHT_SERVICE}/api/v1/flights/${data.flightId}`)
        const flightData = flight.data.data
        if(data.noOfSeats > flightData.totalSeats){
            throw new AppError('Not Enough seats available',StatusCodes.BAD_REQUEST)
        }
        const totalBillingAmount = data.noOfSeats*flightData.price
        const bookingPayload = {...data,totalCost:totalBillingAmount}
        const booking = await bookingRepository.createBooking(bookingPayload,transaction)
        
        await axios.patch(`${ServerConfig.FLIGHT_SERVICE}/api/v1/flights/${data.flightId}/seats`,{
            seats: data.noOfSeats
        })
        await transaction.commit()
        return booking
    } catch (error) {
        await transaction.rollback()   
        throw error
    }
}

async function makePayment(data){
    const transaction = await db.sequelize.transaction()
    try {
        const bookingDetails = await bookingRepository.get(data.bookingId,transaction)
        if(bookingDetails.totalCost !== data.totalCost){
            throw new AppError('The amount of the payment doesnt match',StatusCodes.BAD_REQUEST)
        }
        if(bookingDetails.userId !== data.userId){
            throw new AppError('The user corresponding to the booking doesnt match',StatusCodes.BAD_REQUEST)
        }
        // we assume here that payment is successful -> Integration of Payment Gateway
        const response = await bookingRepository.update(data.bookingId,{status:BOOKED},transaction)
        await transaction.commit()
        return response
    } catch (error) {
        await transaction.rollback()
        throw error
    }
}
 
module.exports = {
  createBooking,
  makePayment
};
