const express = require('express')
const bodyParser = require('body-parser')
const server = express();


const mongoose = require('mongoose')

const session = require('express-session')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy


server.use(bodyParser.urlencoded())
server.use(bodyParser.json())
server.use(express.static('./Build'))


server.use(session({
    secret: "secret-word"
}));
server.use(passport.initialize());
server.use(passport.session());




//database connection

mongoose.connect("mongodb://admin:admin1122@ds161024.mlab.com:61024/umair_school_management",{ useNewUrlParser: true } ,() => {
    console.log("Mubarakaan data base chal gai")
});

//database models

const Student = mongoose.model('Student', {
    name: String,
    fname: String,
    class: String,
    DOB: String,
    mobile: String,
    address: String,
    rollNo: Number,
    fee: Number
});

const Teacher = mongoose.model('Teacher', {
    name : String,
    fname : String,
    DOB : String,
    mobile : String,
    address :String,
    email : String,
    qualification : String,
    rank: String,
    pay : Number
});





server.post('/addStudents', (req, res) => {

    const student = new Student({
        name: req.body.name,
        fname: req.body.fname,
        class: req.body.class,
        DOB: req.body.DOB,
        mobile: req.body.mobile,
        address: req.body.address,
        rollNo: req.body.rollNo,
        fee: req.body.fee
    });

    student.save(() => {
        console.log("student is saved");
    })

    res.send({success : true , data : student})
})


server.post('/addTeacher', (req, res) => {

    const teacher = new Teacher({
        name: req.body.name,
        fname: req.body.fname,
        email: req.body.email,
        DOB: req.body.DOB,
        mobile: req.body.mobile,
        address: req.body.address,
        qualification: req.body.qualification,
        rank: 'teacher',
        pay: req.body.pay

    });

    teacher.save(() => {
        console.log("teacher is saved");
    })

    res.send({success : true , data : teacher})
})

server.post('/showDetails', (req, res) => {
    let classname = req.body.class;
    Student.find({class : classname} , (err , student)=> {
        
        if(err) return console.log(err);
        res.send(student)

    })
})


server.get('/getTeachers', (req, res) => {
    Teacher.find({rank:'teacher'} , (err , teacher) =>{
        if(err) return console.log(err);
        res.send(teacher);
    })
})

server.post('/showStudent', (req, res) => {

    Student.find({class : req.body.class , rollNo : req.body.rollNo } , (err , student)=> {
        
        if(err) return console.log(err);
        res.send(student)

    })
})

server.post('/expelStudent', (req, res) => {

    Student.deleteOne({class : req.body.class , rollNo : req.body.rollNo } , (err)=> {
        
        if(err) return console.log(err);
        res.send("Student Is Expelled");

    })
})


server.post('/expelTeacher', (req, res) => {

    Teacher.deleteOne({name: req.body.name } , (err)=> {
        
        if(err) return console.log(err);
        res.send("Teacher Is Expelled");

    })
})






server.use((err, req, res, nex) => {
    console.log(err)

    res.status(500).send('Something went wrong')

})
var port = process.env.port || 3000;
server.listen( port , () => console.log('server is running succesfully at  '+ port  ))