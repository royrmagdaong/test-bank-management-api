require('dotenv').config()

const express = require('express')
var cors = require('cors');
const app = express()
const {createServer} = require('http')
const {Server} = require('socket.io')
const mongoose = require('mongoose')
const httpServer = createServer(app);
const io = new Server(httpServer, { cors:{ origin: '*'} });

app.use(express.json())
app.use(cors());

app.use((req, res, next)=>{
    req.io = io
    next()
})

// Database connection
mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})

const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connected to Database'))

// import routes
const UserRoutes = require('./routes/Users')

// Routes
app.use('/user', UserRoutes)


httpServer.listen(process.env.PORT, () => console.log(`Server Started at port ${process.env.PORT}`))
