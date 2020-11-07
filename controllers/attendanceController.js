const Attendance = require('../mongo-schema/attendanceSchema');

exports.student_attendance_full = (req, res)=>{
    console.log("Triggered function students_list");

    Student.find({}, (err, docs)=>{
        if(err){
            console.log(err);
        } else{
            console.log(docs);
            res.json(docs);
        }
    });
};

exports.class_attendance_full = (req,res)=>{
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

exports.staff_attendance_full = (req, res)=>{
    res.send('View all attendance for one staff not yet available');
};

exports.student_class_attendance = (req, res)=>{
    res.send("View one student's attendance in one class not yet available");
};

// Add a new comment entry
// TO ADD -

exports.attendance_addNew = (req, res)=>{
    console.log("Triggered function attendance_addNew");

    const userInput = req.body;
    console.log(userInput);

    const newEntry = new Attendance(userInput);
    
    newEntry.save((err, result)=>{
        if(err){
            console.log(err);
        } else{
            console.log(result);
            res.json(result);
        }
    })
};

exports.attendance_update = (req,res)=>{
    res.send('Update one existing attendance entry not yet implemented');
};

