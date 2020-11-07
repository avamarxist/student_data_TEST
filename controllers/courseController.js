const { set } = require('mongoose');
const { genericCb } = require('../helpers');
const Course = require('../mongo-schema/courseSchema');
const Student = require('../mongo-schema/studentSchema');
const Staff = require('../mongo-schema/staffSchema');

exports.course_list_full = (req, res)=>{
    console.log("Triggered function course_list_full");

    Course.find({}, (err, docs)=>{
        if(err){
            console.log(err);
            return err;
        } else{
            res.json(docs);
        }
    });
};

exports.course_list_active = (req,res)=>{
    console.log("Triggered function course_list_active");
    let courseID = req.params.id;
    console.log(`Staff id: ${courseID}`);
    Course.findById(courseID, (err, docs)=>{
        if(err){
            console.log(err);
        } else{
            console.log(docs);
            res.json(docs);
        }
    });
};


// Add one new staff to system. 
// TO FIX -- check if course exists in system already (year+term+staff+period)
// TO FIX -- refactor using ref in schema + populate

exports.course_addNew = (req, res)=>{
    console.log("Triggered function course_addNew");

    const userInput = req.body;
    // console.log(userInput);

    let staffIdArray = userInput["staff"];
    let studentIdArray = userInput["roster"].map((student)=>student["student_id"]);
    
    let codeArray = userInput["roster"].map((student)=>student["code"]);
    let updatedCodes = [...new Set(codeArray)];
    userInput["codes"] = updatedCodes

    const newCourse = new Course(userInput);

    staffIdArray.forEach((x) => {
        Staff.findByIdAndUpdate(x, {$push: {activeCourses: newCourse.id}}, (err, result)=>{
            if(err){ console.log(err);} 
        })
    });

    studentIdArray.forEach((x)=>{
        Student.findByIdAndUpdate(x, {$push:{activeCourses: newCourse.id}}, (err, result)=>{
            if(err){console.log(err);}
        });
    });



    newCourse.save((err, result)=>{
        if(err){
            console.log(err);
        } else{
            res.json(result);
            // Student.populate('activeCourses').exec(genericCb);
            // Staff.populate('activeCourses').exec(genericCb);
        }
    })
};

exports.course_update = (req,res)=>{
    res.send('Update class not yet implemented');
};

