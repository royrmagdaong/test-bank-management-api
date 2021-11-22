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
const Course = require('../models/course')
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
                        './models/course'
                    ])
                
                    // clear models
                    await seeder.clearModels([
                        'User',
                        'Admin',
                        'Student',
                        'Professor',
                        'Subject',
                        'Course'
                    ], async ()=> {

                        // create admin user
                        await populateUserAdmin(roles, hashPassword)

                        // populate user and department
                        await populateUserProfessor(roles, hashPassword)
                        
                        // populate user and student
                        await populateUserStudent(roles, hashPassword)
                        
                        // populate course
                        await populateCourse()

                        // populate subject
                        await populateSubject()

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
        year_level: '1st'
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
        year_level: '2nd'
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
        year_level: '4th'
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

const course = [
    {
        code: "BSIT",
        description: "BS in Information Technology",
        sections: ['A','B','C','D']
    },
    {
        code: "BSOA",
        description: "BS in Office Administration",
        sections: ['A','B','C','D']
    },
    {
        code: "COA",
        description: "Certificate in Office Administration",
        sections: ['A','B','C','D']
    },
    {
        code: "CCS",
        description: "Certificate in Computer Science",
        sections: ['A','B','C','D']
    },
    {
        code: "CHS",
        description: "Computer Hardware Servicing NCII",
        sections: ['A','B','C','D']
    },
    {
        code: "CHRM",
        description: "Certificate in Hotel and Restaurant Management",
        sections: ['A','B','C','D']
    }
]

const subject = [
    {
        code: 'MATH1',
        description: 'Elementary Algebra'
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

const populateCourse = async () => {
    for(let i = 0; i<course.length;i++){
        let course_ = await new Course({
            code: course[i].code,
            description: course[i].description,
            sections: course[i].sections
        })
        await course_.save((err, newCourse) =>{
            if(err){ return console.log('failed to create course.') }
            if(newCourse){
                console.log(newCourse.code + ' course created.')
            }else{
                return console.log('failed to create course.') 
            }
        })
    }
}

const populateSubject = async () => {
    for(let i = 0; i<subject.length;i++){
        let subject_ = await new Subject({
            code: subject[i].code,
            description: subject[i].description
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