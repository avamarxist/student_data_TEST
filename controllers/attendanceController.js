const {genericCb} = require('../helpers');

const Attendance = require('../mongo-schema/attendanceSchema');
const { findOneAndUpdate } = require('../mongo-schema/courseSchema');
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

exports.class_list_get = async (req,res)=>{

    if(!req.user){res.redirect('/auth/login')}

    let staffId = req.query.staff || req.user.staff_id;
    let status = req.query.status;
    let period = parseInt(req.query.period);
    
    let queries = {
        beginDate: req.query.beginDate,
        endDate: req.query.endDate
    }

    console.log(period);

    let attMatch = {
        staff: staffId
    }
    if(period){attMatch["period"] = period;}

    let output = await Attendance.aggregate()
        .lookup({from: 'courses', localField: 'course', foreignField: '_id', as: 'courseInfo'})
        .match({
            'courseInfo.staff': {$elemMatch: {$eq: staffId}},
            'courseInfo.period': period
        })
        .unwind('attendance')
        .group({
            _id: "$attendance.student",
            attendance: {
                $addToSet: {
                    date: "$date",
                    atsCode: "$attendance.atsCode"
                }
            }
        })
        .lookup({from: 'students', localField: '_id', foreignField: '_id', as: 'studentInfo'})
        .unwind('studentInfo')
        .sort("studentInfo.lName")

    // res.send(output);
    // console.log(queries);
    res.render('pages/viewAttendanceList', {data: output, message: "", params: queries})
};

exports.class_calendar_get = async (req,res)=>{

    if(!req.user){res.redirect('/auth/login')}

    let staffId = req.query.staff || req.user.staff_id;
    let status = req.query.status;
    let period = parseInt(req.query.period);
    
    let queries = {
        beginDate: req.query.beginDate,
        endDate: req.query.endDate
    }

    console.log(period);

    let attMatch = {
        staff: staffId
    }
    if(period){attMatch["period"] = period;}

    let output = await Attendance.aggregate()
        .lookup({from: 'courses', localField: 'course', foreignField: '_id', as: 'courseInfo'})
        .match({
            'courseInfo.staff': {$elemMatch: {$eq: staffId}},
            'courseInfo.period': period
        })
        .unwind('attendance')
        .group({
            _id: "$attendance.student",
            attendance: {
                $addToSet: {
                    date: "$date",
                    atsCode: "$attendance.atsCode"
                }
            }
        })
        .lookup({from: 'students', localField: '_id', foreignField: '_id', as: 'studentInfo'})
        .unwind('studentInfo')
        .sort("studentInfo.lName")

    // res.send(output);
    // console.log(queries);
    res.render('pages/viewAttendanceClass', {data: output, message: "", params: queries})
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

    let course = req.query.course; 
    let period = parseInt(req.query.period);
    let date = new Date(req.query.date);

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
    // let activeStaff = req.session.activeStaff ? req.session.activeStaff : await Staff.find({}, '_id lName fName');
    
    let courseFilter = {
        staff: {$elemMatch: {$eq: req.user.staff_id}},
    }
    if(period){courseFilter["period"] = period}
    else if(course){courseFilter["_id"] = course};

    let attFilter = {}
    if(period){attFilter["period"] = period}
    else if(course){attFilter["course"] = course}
    console.log(attFilter);

    let roster={};
    let attendance = {};
    if(period || course){   
        roster = await Course.aggregate()
            .match(courseFilter)
            .group({
                _id: "$period", 
                entry: {
                    $push: {
                        course: "$_id",
                        students: "$students"
                    }
                }
            })
            .unwind('entry')
            .project('-_id entry')
            .unwind('entry.students')
            .lookup({from: 'students', localField: 'entry.students.student_id', foreignField: "_id", as: "studentInfo"})
            .project('-_id entry.course studentInfo')
            .unwind('studentInfo')
            .sort('studentInfo.lName')
        
        attendance = await Attendance.aggregate()
            .match({date: date})
            .lookup({from: 'courses', localField: 'course', foreignField: '_id', as: 'courseInfo'})
            .match({'courseInfo.period': period})
            .group({
                _id: "$courseInfo.period",
                attendance: {
                    $push: "$attendance"
                }
            })
            .project('-_id attendance')
            .unwind('attendance')
            .unwind('attendance')
            .project({student: "$attendance.student", atsCode: '$attendance.atsCode'})
            .lookup({from:'students', localField:'student', foreignField: '_id', as: 'studentInfo'})
            .project({studentId: '$student', atsCode: '$atsCode', lName: '$studentInfo.lName', fName: '$studentInfo.fName'})
            .unwind('lName')
            .unwind('fName')

    } else{
        roster = [];
        attendance = [];
    }
    
    let data = {activeCourses: sortedCourses, roster: roster, attendance: attendance}

    res.render('pages/addAttendanceSelect', {data: data, message: "", params: req.query});
}

exports.post_addNew = async (req, res)=>{
    console.log("Triggered function attendance_addNew");

    if(!req.user){res.redirect('/auth/login')}
    
    const userInput = req.body;
    // console.log("Input:");
    // console.log(userInput);

    let staffId = req.user.staff_id;
    let rawDate = userInput.date;
    let entryDate = new Date(rawDate);
    delete userInput.course;
    delete userInput.date;

    let courseId = userInput.courseId;
    delete userInput.courseId;
    let attendance = Object.entries(userInput);
    let courses = {};
    for(let i=0; i< courseId.length; i++){
        let c = courseId[i];
        if(!courses[c]){courses[c] = []}
        courses[c].push({
            student: attendance[i][0],
            atsCode: attendance[i][1]
        })
    }

    // console.log(Object.entries(courses))


    let output = []
    for(let course of Object.entries(courses)){
        
        let result = await Attendance.update({
            date: entryDate, 
            staff: staffId, 
            course: course[0]
        }, {
            date: entryDate,
            staff: staffId,
            course: course[0],
            attendance: course[1]
        }, {
            upsert: true,
            new: true,
            overwrite: true
        });
        output.push(result);
    }

    let redirectPath = `/entries/attendance/add?date=${rawDate}&course=&period=`;
    console.log(`date: ${rawDate}`);
    res.redirect(redirectPath);
};



exports.attendance_update = (req,res)=>{
    res.send('Update one existing attendance entry not yet implemented');
};

