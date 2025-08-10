const express = require('express')

const {ServerConfig,RedisServer} = require('./config')
const apiRoutes = require('./routes')
const scheduleCrons = require('./utils/common/cron-jobs')

const {connectRedis} = RedisServer

const app = express()



app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use('/api',apiRoutes)

const startServer = async () => {
    try {
        await connectRedis()

        app.listen(ServerConfig.PORT, () => {
            console.log(`Server started on PORT : ${ServerConfig.PORT}`)
            scheduleCrons()
        })
    } catch (error) {
        console.log('Failed to start the server:',error)
        process.exit(1)
    }
}

startServer()
