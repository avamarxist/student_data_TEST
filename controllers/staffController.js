const {queryCb} = require('../helpers');
const mongoose = require('mongoose');

const Staff = require('../mongo-schema/staffSchema');
const Course = require('../mongo-schema/courseSchema');
const Comment = require('../mongo-schema/commentSchema');

exports.staff_list = (req, res)=>{
    console.log("Triggered function staff_list");;

    Staff.find({status: "active"})
        .sort('lName')
        .populate('courses')
        .exec((err, results)=>{
            if(err){
                console.log(results);
            } else{
                console.log(results);
                res.render('pages/viewStaff', {data: results, message: "", params: {}});
            }
        });
};

exports.staff_detail = async (req,res)=>{
    console.log("Triggered function staff_detail");
    const staffId = mongoose.Types.ObjectId(req.params.id);
    console.log(`Staff id: ${staffId}`);

    let staffInfo = await Staff.findById(staffId);

    let activeCourses = await Course.aggregate()
        .match({status: "active", staff: {$elemMatch: {$eq: staffId}}})
        .group({
            _id: "$period",
            classAlias: {$first: '$classAlias'},
            courseNames: {$addToSet: '$courseName'},
            codes: {$addToSet: '$code'}
        })
        .sort('_id')
        
    let recentComments = await Comment.aggregate()
        .match({staff: {$elemMatch: {$eq: staffId}}})
        .limit(5)
        .lookup({from: 'students', localField: 'student', foreignField: '_id', as: 'student'})

    let data = {
        staffInfo: staffInfo,
        activeCourses: activeCourses,
        recentComments: recentComments
    }

    // res.send(recentComments)
    res.render('pages/viewStaffDetail', {data: data, message: "", params: {}});

};


// Add one new staff to system. 
// TO FIX -- check if staff exists in system before adding
exports.staff_addNew = (req, res)=>{
    console.log("Triggered function staff_addNew");

    const userInput = req.body;
    console.log(userInput);

    const newStaff = new Staff(userInput);
    
    newStaff.save((err, result)=>{
        if(err){
            console.log(err);
        } else{
            console.log(result);
            res.redirect('/catalog/staff/view');
        }
    })
};

exports.staff_update = (req,res)=>{
    res.send('Update staff not yet implemented');
};

