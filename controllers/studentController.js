const { session } = require('passport');
const {queryCb} = require('../helpers');
const Comment = require('../mongo-schema/commentSchema');
const Staff = require('../mongo-schema/staffSchema');
const Student = require('../mongo-schema/studentSchema');

exports.students_list = (req, res)=>{
    console.log("Triggered function students_list");

    Student.find({}, 'osis lName fName', (err, results)=>{
        if(err){
            console.log(err);
        } else{
            res.render('pages/viewStudents', {data: results, message: "", params: {}});
        }
    });
};

exports.student_detail = async (req,res)=>{
    console.log("Triggered function students_detail");
    
    let studentID;
    if(req.body.student){studentID = req.body.student}
    else{studentID = req.params.id;}
    console.log(studentID);

    let activeStudents;
    if(req.session.activeStudents){ activeStudents = req.session.activeStudents; }
    else{
        activeStudents = await Student.find({status: "active"});
        session.activeStudents = activeStudents;
    }

    let data = await Student.findById(studentID).populate('courses.courseId');
    
    // console.log(`active students: ${activeStudents.length}`);
    // console.log(data);
    res.render('pages/viewStudentDetails', {data: data, activeStudents: activeStudents, message: "", params: {} });
};

exports.student_addNew = (req, res)=>{
    console.log("Triggered function student_addNew");

    const userInput = req.body;
    console.log(userInput);
    console.log(typeof(userInput));

    const newStudent = new Student(userInput);
    
    newStudent.save((err, result)=>{
        if(err){
            console.log(err);
        } else{
            console.log(result);
            res.json(result);
        }
    })
};

exports.student_update_get = async (req,res)=>{
    if(!req.user){ res.redirect('/auth/login'); }
    
    // get info for selected student
    let currentInfo = await Student.findById(req.params.id)

    // res.send(currentInfo);
    res.render('pages/editStudent', { data: currentInfo, message: "", params: {} })
};

