const {queryCb} = require('../helpers');

const Student = require('../mongo-schema/studentSchema');

exports.students_list = (req, res)=>{
    console.log("Triggered function students_list");

    Student.find({}, 'osis lName fName', (err, results)=>{
        if(err){
            console.log(err);
        } else{
            res.render('pages/viewStudents', {data: results});
        }
    });
};

exports.student_detail = (req,res)=>{
    console.log("Triggered function students_detail");
    let studentID = req.params.id;
    console.log(`student id: ${studentID}`);
    Student.findById(studentID, (err, docs)=>{
        if(err){
            console.log(err);
        } else{
            console.log(JSON.stringify(docs, null, 4));
            res.json(docs);
        }
    });
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

exports.student_update = (req,res)=>{
    res.send('Update student not yet implemented');
};

