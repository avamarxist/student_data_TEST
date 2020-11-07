const {genericCb} = require('../helpers');

const Comment = require('../mongo-schema/commentSchema');
const Staff = require('../mongo-schema/staffSchema');
const Student = require('../mongo-schema/studentSchema');

exports.comment_list = (req, res)=>{
    console.log("Triggered function comment_list");

    let studentId = req.query.studentId;
    let staffId = req.query.staffId;
    
    let fromDate = req.query.fromDate;
    let toDate = req.query.toDate;

    let query = {};

    if(studentId){ query["studentId"] = studentId }
    if(staffId){ query["staffId"] = staffId }
    if(fromDate){ query["createdAt"] = {$gte: fromDate} }
    if(toDate){ query["createdAt"] = {$lte: toDate}}

    Comment.find(query, (err, result)=>{
        if(err){ console.log(err) }
        else{ res.json(result) }
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


// Add one new comment to system. 
// ADDED -- adds comment id to comment arrays in staff/student collections
// TO FIX -- check if staff/student exist in system before adding
exports.comment_addNew = (req, res)=>{
    console.log("Triggered function comment_addNew");

    const userInput = req.body;
    console.log(userInput);

    let staffIdArray = userInput["staff"];
    let studentIdArray = userInput["student"];

    const newComment = new Comment(userInput);

    staffIdArray.forEach((x)=>{
        Staff.findByIdAndUpdate(x, {$push: {comments: newComment.id}}, {upsert: true}, genericCb);
    });
    
    studentIdArray.forEach((x)=>{
        Student.findByIdAndUpdate(x, {$push: {comments: newComment.id}}, {upsert: true}, genericCb);
    });
    
    newComment.save((err, result)=>{
        if(err){
            console.log(err);
        } else{
            console.log(result);
            res.json(result);
        }
    })
};

exports.staff_update = (req,res)=>{
    res.send('Update staff not yet implemented');
};

