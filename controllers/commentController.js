const {genericCb} = require('../helpers');

const Comment = require('../mongo-schema/commentSchema');
const Staff = require('../mongo-schema/staffSchema');
const Student = require('../mongo-schema/studentSchema');

exports.comment_list = (req, res)=>{
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

    // console.log("Query");
    // console.log(query);

    const search = async() => {
        let [data, activeStaff, activeStudents] = await Promise.all([Comment.find(query).populate('student', 'osis lName fName').populate('staff', 'lName fName'), Staff.find({status:"active"}, '_id lName fName'), Student.find({status:"active"}, '_id osis lName fName')]);
        return {data, activeStaff, activeStudents};
    }

    search().then((results)=>{
        res.render('pages/viewComment', {data:results});
    });
}


exports.comment_calendar = (req,res)=>{
    console.log("Triggered function students_detail");
    let staffID = req.params.id;
    console.log(`Staff id: ${staffID}`);
    Staff.findById(staffID, (err, docs)=>{
        if(err){
            console.log(err);
        } else{
            console.log(JSON.stringify(docs, null, 4));
            res.json(docs);
        }
    });
};

exports.comment_addNew_get = (req, res)=>{
    console.log("Triggered function comment_addNew_get");

    const queries = async ()=>{
        let [activeStaff, activeStudents] = await Promise.all([Staff.find({status:"active"}, '_id lName fName'), Student.find({status:"active"}, '_id osis lName fName')]);
        return {activeStaff, activeStudents};
    }

    queries().then((results)=>{
        res.render('pages/addComment', {data: results});
    });
}

// Add one new comment to system. 
// ADDED -- adds comment id to comment arrays in staff/student collections
// TO FIX -- check if staff/student exist in system before adding
exports.comment_addNew_post = (req, res)=>{
    console.log("Triggered function comment_addNew");

    const userInput = req.body;
    console.log(userInput);


    const newComment = new Comment(userInput);

    Staff.findByIdAndUpdate(userInput.staff, {$addToSet: {comments: newComment.id}}, {upsert: true}, genericCb);
    
    Student.findByIdAndUpdate(userInput.student, {$addToSet: {comments: newComment.id}}, {upsert: true}, genericCb);
    
    newComment.save((err, result)=>{
        if(err){
            console.log(err);
        } else{
            console.log(result);
            res.json(result);
        }
    })
};

exports.comment_update = (req,res)=>{
    res.send('Update staff not yet implemented');
};

