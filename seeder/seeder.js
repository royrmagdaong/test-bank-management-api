require('dotenv').config()
const seeder = require('mongoose-seed');
const bcrypt = require('bcrypt')
const Role = require('../models/role');
const generateCode = require('../middlewares/generateCode')
const User = require('../models/user')
const Admin = require('../models/admin')
const Student = require('../models/student')
const Professor = require('../models/professor')
const Subject = require('../models/subject')
const GradeLevel = require('../models/grade-level')
const Room = require('../models/room')
const Class = require('../models/class')
const fs = require('fs')

let password = 'password'

seeder.connect(process.env.DATABASE_URL, { useUnifiedTopology: true, useNewUrlParser: true }, async function() {
    await Role.deleteMany({}).exec(async (err)=>{
        if(err) console.log(err)
        console.log('roles collection cleared.')
        const roles = await new Role(
            {
                ADMIN: 'admin',
                PROFESSOR: 'professor',
                STUDENT: 'student'
            }
        )

        await roles.save( async (err, newRoles) => {
            if(err) console.log(err)
            if(newRoles) console.log('roles created.')

            await bcrypt.hash(password, 10, async (err, hashPassword) => {
                if(err){
                    console.log(err)
                }else{
                    
                    // load models
                    await seeder.loadModels([
                        './models/user',
                        './models/admin',
                        './models/student',
                        './models/professor',
                        './models/subject',
                        './models/grade-level',
                        './models/room',
                        './models/class',
                        './models/quiz',
                        './models/activity',
                        './models/exam',
                    ])
                
                    // clear models
                    await seeder.clearModels([
                        'User',
                        'Admin',
                        'Student',
                        'Professor',
                        'Subject',
                        'GradeLevel',
                        'Room',
                        'Class',
                        'Quiz',
                        'Activity',
                        'Exam',
                    ], async ()=> {

                        // create admin user
                        await populateUserAdmin(roles, hashPassword)

                        // populate user and department
                        await populateUserProfessor(roles, hashPassword)
                        
                        // populate user and student
                        await populateUserStudent(roles, hashPassword)
                        
                        // populate grade level
                        await populateGradeLevel()

                        // populate subject
                        await populateSubject()

                        // populate room
                        await populateRoom()

                        await setTimeout(()=>{
                            seeder.disconnect();
                        }, 1000)
                    })
                }
            })
        })
    })
})
const admin = [
    {
        first_name: 'Juan',
        middle_name: 'Montez',
        last_name: 'Dela Cruz',
        birth_day: '12-01-1989',
        gender: 'Male',
        email: 'admin@gmail.com'
    }
]

const student = [
    {
        student_id: '202100000',
        first_name: 'Angelo',
        middle_name: 'Manalansan',
        last_name: 'Tagugib',
        birth_day: "01-01-1998",
        gender: 'M',
        email: 'angelo@gmail.com',
        course: 'BSIT',
        section: 'B',
        year_level: 'Grade 11'
    },
    {
        student_id: '202100000',
        first_name: 'Alejandro',
        middle_name: 'Cruz',
        last_name: 'Perez',
        birth_day: "01-01-1993",
        gender: 'M',
        email: 'alejandro@gmail.com',
        course: 'BSIT',
        section: 'A',
        year_level: 'Grade 11'
    },
    {
        student_id: '202100000',
        first_name: 'Peterson',
        middle_name: 'Pelaez',
        last_name: 'Morte',
        birth_day: "03-22-1996",
        gender: 'M',
        email: 'peterson@gmail.com',
        course: 'BSOA',
        section: 'C',
        year_level: 'Grade 12'
    }
]

const professor = [
    {
        id_number: '2100000',
        index: 1,
        department: '',
        email: 'professor1@gmail.com',
        first_name: 'Professor 1',
        middle_name: 'prof1',
        last_name: 'Prof1',
        birth_day: "01-01-1991",
        gender: 'M'
    }
]

const grade_level = [
    {
        index: 1,
        grade_level: "Grade 11",
        description: '1st year senior high',
        section: 'A'
    }
]

const subject = [
    {
        index:1,
        code: 'MATH1',
        description: 'Elementary Algebra',
        grade_level: 'Grade 11'
    }
]

const room = [
    {
        index:1,
        room: 'Room 101'
    }
]


const populateUserStudent = async (roles, hashPassword) => {
    for(let i = 0; i<student.length;i++){
        let user = await new User({
            role: roles.STUDENT,
            account_name: student[i].first_name + ' ' + student[i].last_name,
            email: student[i].email,
            password: hashPassword,
            verificationCode: generateCode(),
            is_verified: true
        })
        user.save(async (err, newUser)=>{
            if(err){ return console.log('failed to create user student.') }
            if(newUser){
                let stdt = await new Student({
                    user_id: newUser._id,
                    index: i+1,
                    student_id: `${student[i].student_id}${i}`,
                    email: student[i].email,
                    gender: student[i].gender,
                    first_name: student[i].first_name,
                    middle_name: student[i].middle_name,
                    last_name: student[i].last_name,
                    birth_day: student[i].birth_day,
                    course: student[i].course,
                    section: student[i].section,
                    year_level: student[i].year_level,
                    academic_year: '2020-2021',
                    status: 'New Student'
                })
                await stdt.save(async (err, newStudent) =>{
                    if(err){ return console.log('failed to create user student.') }
                    if(newStudent){
                        console.log(newStudent.email + ' student created.')
                    }else{
                        return console.log('failed to create user student.') 
                    }
                })
            }else{
                return console.log('failed to create user student.') 
            }
        })
    }
}

const populateUserAdmin = async (roles, hashPassword) => {
    for(let i = 0; i<admin.length;i++){
        let user = await new User({
            role: roles.ADMIN,
            account_name: admin[i].first_name + ' ' + admin[i].last_name,
            email: admin[i].email,
            password: hashPassword,
            verificationCode: generateCode(),
            is_verified: true
        })
        user.save(async (err, newUser)=>{
            if(err){ return console.log('failed to create user admin.') }
            if(newUser){
                let admin_ = await new Admin({
                    user_id: newUser._id,
                    email: admin[i].email,
                    gender: admin[i].gender,
                    first_name: admin[i].first_name,
                    middle_name: admin[i].middle_name,
                    last_name: admin[i].last_name,
                    birth_day: admin[i].birth_day
                })
                await admin_.save(async (err, newAdmin) =>{
                    if(err){ return console.log('failed to create user admin.') }
                    if(newAdmin){
                        console.log(newAdmin.email + ' admin created.')
                    }else{
                        return console.log('failed to create user admin.') 
                    }
                })
            }else{
                return console.log('failed to create user admin.') 
            }
        })
    }
}

const populateUserProfessor = async (roles, hashPassword) => {
    for(let i = 0; i<professor.length;i++){
        let user = await new User({
            role: roles.PROFESSOR,
            account_name: professor[i].first_name + ' ' + professor[i].last_name,
            email: professor[i].email,
            password: hashPassword,
            verificationCode: generateCode(),
            is_verified: true
        })
        user.save(async (err, newUser)=>{
            if(err){ return console.log('failed to create user professor.') }
            if(newUser){
                let prof = await new Professor({
                    user_id: newUser._id,
                    index: professor[i].index,
                    id_number: professor[i].id_number,
                    department: professor[i].department,
                    email: professor[i].email,
                    gender: professor[i].gender,
                    first_name: professor[i].first_name,
                    middle_name: professor[i].middle_name,
                    last_name: professor[i].last_name,
                    birth_day: professor[i].birth_day
                })
                await prof.save(async (err, newProf) =>{
                    if(err){ return console.log('failed to create user professor.') }
                    if(newProf){
                        console.log(newProf.email + ' professor created.')
                    }else{
                        return console.log('failed to create user professor.') 
                    }
                })
            }else{
                return console.log('failed to create user professor.') 
            }
        })
    }
}

const populateGradeLevel = async () => {
    for(let i = 0; i<grade_level.length;i++){
        let grade_ = await new GradeLevel({
            index: grade_level[i].index,
            description: grade_level[i].description,
            grade_level: grade_level[i].grade_level,
            section: grade_level[i].section
        })
        await grade_.save((err, newGradeLevel) =>{
            if(err){ return console.log('failed to create new grade level.') }
            if(newGradeLevel){
                console.log(newGradeLevel.grade_level + ' grade level created.')
            }else{
                return console.log('failed to create new grade level.') 
            }
        })
    }
}

const populateSubject = async () => {
    for(let i = 0; i<subject.length;i++){
        let subject_ = await new Subject({
            index: subject[i].index,
            code: subject[i].code,
            description: subject[i].description,
            grade_level: subject[i].grade_level
        })
        await subject_.save((err, newSubj) =>{
            if(err){ return console.log('failed to create subject.') }
            if(newSubj){
                console.log(newSubj.code + ' subject created.')
            }else{
                return console.log('failed to create subject.') 
            }
        })
    }
}

const populateRoom = async () => {
    for(let i = 0; i<room.length;i++){
        let room_ = await new Room({
            index: room[i].index,
            room: room[i].room
        })
        await room_.save((err, newRoom) =>{
            if(err){ return console.log('failed to create room.') }
            if(newRoom){
                console.log(newRoom.room + ' room created.')
            }else{
                return console.log('failed to create room.') 
            }
        })
    }
}