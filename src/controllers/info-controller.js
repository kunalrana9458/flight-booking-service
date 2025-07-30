const {StatusCodes} = require('http-status-codes')


const infoController = async(req,res) => {
    return res.status(StatusCodes.OK).json({
        Success:true,
        message:"This is the information Route"
    })
}

module.exports = {
    infoController
}


