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
const StudentRoutes = require('./routes/Student')
const ProfessorRoutes = require('./routes/Professor')
const SubjectRoutes = require('./routes/Subject')
const GradeLevelRoutes = require('./routes/GradeLevel')
const ClassRoutes = require('./routes/Class')
const RoomRoutes = require('./routes/Room')
const ActivityRoutes = require('./routes/Activity')
const QuizRoutes = require('./routes/Quiz')
const ExamRoutes = require('./routes/Exam')

// Routes
app.use('/user', UserRoutes)
app.use('/student', StudentRoutes)
app.use('/prof', ProfessorRoutes)
app.use('/subject', SubjectRoutes)
app.use('/grade-level', GradeLevelRoutes)
app.use('/class', ClassRoutes)
app.use('/room', RoomRoutes)
app.use('/activity', ActivityRoutes)
app.use('/quiz', QuizRoutes)
app.use('/exam', ExamRoutes)


httpServer.listen(process.env.PORT, () => console.log(`Server Started at port ${process.env.PORT}`))
