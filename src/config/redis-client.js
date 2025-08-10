const {createClient} = require('redis')

const redisClient = createClient({
    socket:{
        host: '127.0.0.1',
        port: 6379
    }
})

redisClient.on('error',(err) => console.error('Redis Client Error',err))

const connectRedis = async () => {
    await redisClient.connect()
    console.log('Connected to Redis');
}

console.log('Connected to Redis')

module.exports = { redisClient,connectRedis }