const {genericCb} = require('../helpers');

const Comment = require('../mongo-schema/commentSchema');
const Staff = require('../mongo-schema/staffSchema');
const Student = require('../mongo-schema/studentSchema');


exports.comment_list = async (req, res)=>{
    console.log("Triggered function comment_list");

    // console.log("req.body");
    // console.log(req.body);

    let student = req.body.student;
    let staff = req.body.staff;
    
    let fromDate = req.query.fromDate;
    let toDate = req.query.toDate;

    let query = {};

    if(student){ query["student"] = student }
    if(staff){ query["staff"] = staff }
    if(fromDate){ query["createdAt"] = {$gte: fromDate} }
    if(toDate){ query["createdAt"] = {$lte: toDate}}

    let data = await Comment.find(query).populate('student', 'osis lName fName').populate('staff', 'lName fName'); 
    let activeStaff = req.session.activeStaff ? req.session.activeStaff : await Staff.find({}, '_id lName fName');
    let activeStudents = req.session.activeStudents ? req.session.activeStudents : await Student.find({status:"active"}, '_id osis lName fName');


    let results = {data, activeStaff, activeStudents};
    console.log(data);
    res.render('pages/viewComment', {data:results, message: "", params: {}});
}


exports.comment_calendar_get = async (req,res)=>{

    console.log("Triggered function comment_calendar");


    let student = req.body.student;
    let staff = req.body.staff;
    
    let now = new Date();
    let endDate = req.query.endDate || now.toUTCString();
    let beginDate;
    if(req.query.beginDate){beginDate = req.query.beginDate}
    else{
        now.setDate(now.getDate()-7);
        beginDate = now.toUTCString();
    }

    let query = {commentDateTime: {$gte: new Date(beginDate), $lte: new Date(endDate)}};

    if(student){ query["student"] = student }
    if(staff){ query["staff"] = staff }

    let comments = await Comment.aggregate()
        .match(query)
        .unwind('student')
        .unwind('staff')
        .lookup({from: 'students', localField: 'student', foreignField: '_id', as: 'studentInfo'})
        .lookup({from: 'staff', localField: 'staff', foreignField: '_id', as: 'staffInfo'})
        .project({
            _id: '$_id',
            staffId: '$staff',
            staffLast: '$staffInfo.lName',
            staffFirst: '$staffInfo.fName',
            date: '$commentDateTime',
            studentId: '$student',
            studentLast: '$studentInfo.lName',
            studentFirst: '$studentInfo.fName',
            note: '$note'
        })
        .unwind('staffLast').unwind('staffFirst').unwind('studentLast').unwind('studentFirst')
        .sort('date')
        .group({
            _id: '$studentId',
            studentLast: {$first: '$studentLast'},
            studentFirst: {$first: '$studentFirst'},
            comments:{
                $addToSet: {
                    date: "$date",
                    note: '$note',
                    staffId: '$staffId',
                    staffLast: '$staffLast',
                    staffFirst: '$staffFirst'
                }
            }
        })
        .sort('studentLast studentFirst')

    let activeStaff = req.session.activeStaff ? req.session.activeStaff : await Staff.find({}, '_id lName fName');
    let activeStudents = req.session.activeStudents ? req.session.activeStudents : await Student.find({status:"active"}, '_id osis lName fName');


    let data = {comments, activeStaff, activeStudents}
    let params = {beginDate: beginDate, endDate: endDate};

    // console.log(matches);
    console.log(data);
    console.log(activeStudents);
    // res.send(data);
    res.render('pages/viewCommentCalendar', {data: data, message: "", params: params})
};

exports.comment_addNew_get = (req, res)=>{
    console.log("Triggered function comment_addNew_get");

    const queries = async ()=>{
        let [activeStaff, activeStudents] = await Promise.all([
            Staff.find({status:"active"}, '_id lName fName').sort({lName: 'ascending'}), 
            Student.find({status:"active"}, '_id osis lName fName').sort({lName: 'ascending'})
        ]);
        return {activeStaff, activeStudents};
    }

    queries().then((results)=>{
        res.render('pages/addComment', {data: results, message: "", params: {}});
    });
}

// Add one new comment to system. 
// ADDED -- adds comment id to comment arrays in staff/student collections
// TO FIX -- check if staff/student exist in system before adding
exports.comment_addNew_post = (req, res)=>{
    console.log("Triggered function comment_addNew");

    const userInput = req.body;

    userInput['commentDateTime'] = userInput.date ? userInput.date : new Date();
    delete userInput.date;


    console.log(userInput);

    const newComment = new Comment(userInput);

    Staff.findByIdAndUpdate(userInput.staff, {$addToSet: {comments: newComment.id}}, {}, genericCb);
    
    Student.findByIdAndUpdate(userInput.student, {$addToSet: {comments: newComment.id}}, {}, genericCb);
    
    newComment.save((err, result)=>{
        if(err){console.log(err)}
        else{res.redirect('/entries/comment/add')}
    });
};

exports.comment_update = (req,res)=>{
    res.send('Update staff not yet implemented');
};

