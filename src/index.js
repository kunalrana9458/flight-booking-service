const express = require('express')
const {ServerConfig} = require('./config')


const apiRoutes = require('./routes')

const app = express()

app.use(express.json())
app.use('/api',apiRoutes)

app.listen(ServerConfig.PORT,() => {
    console.log(`Successfully Started the server on PORT: ${ServerConfig.PORT}`); 
});

