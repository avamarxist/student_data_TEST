const {genericCb} = require('../helpers');

const Attendance = require('../mongo-schema/attendanceSchema');
const Course = require('../mongo-schema/courseSchema');
const Staff = require('../mongo-schema/staffSchema');

exports.student_full = (req, res)=>{
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

exports.class_full = (req,res)=>{
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

exports.get_addNew = async (req, res)=>{
    if(!req.user){ res.redirect('/auth/login'); }
    console.log("Triggered get_addNew");
    
    // // if(!req.user.role.includes("teacher")){
    // //     res.send('You must be a teacher to add attendance');
    // //     return;
    // // }

    let course = req.query.course;
    
    let fromDate = req.query.fromDate;
    let toDate = req.query.toDate;

    // if(course){ query[""] = student }
    // if(staff){ query["staff"] = staff }


    let activeCourses = await Staff.findById(req.user.staff_id)
        .select('courses')
        .populate({
            path: 'courses', 
            select: '_id code courseName classAlias section period', 
            match: {status: "active"}
        });
    let sortedCourses = activeCourses.courses.sort((a,b)=>{
        if(a.period > b.period) { return 1 }
        else if (a.period == b.period) {
            if(a.code > b.code) { return 1 }
            else { return -1 }
        } else { return -1 }
    });
    let activeStaff = req.session.activeStaff ? req.session.activeStaff : await Staff.find({}, '_id lName fName');
    
    let query = {};
    if(req.query.course){
        query["_id"] = req.query.course;
    }

    const roster = req.query.course ? await Course.findOne(query, 'students').populate('students.student_id') : [];

    console.log(req.query.course);
    console.log(roster);
    res.render('pages/addAttendanceSelect', {queries: req.query, students: roster.students, courseList: sortedCourses});
}

exports.post_addNew = (req, res)=>{
    console.log("Triggered function attendance_addNew");

    const userInput = req.body;

    let entryObj = {};
    entryObj["staff"] = req.user._id;
    entryObj["class"] = userInput.course;
    entryObj["date"] = new Date(userInput.date);
    
    delete userInput.course;
    delete userInput.date;
    
    // console.log("Entry object");
    // console.log(entryObj);
    // console.log("User input post-processing");
    // console.log(userInput);

    for(let student of Object.entries(userInput)){
        entryObj["student"] = student[0];
        entryObj["attCode"] = student[1][0];
        let entry = new Attendance(entryObj);
        entry.save(genericCb);
    }
    res.send('Attendance entered');
};

exports.attendance_update = (req,res)=>{
    res.send('Update one existing attendance entry not yet implemented');
};

