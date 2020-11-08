const {queryCb} = require('../helpers');

const Staff = require('../mongo-schema/staffSchema');

exports.staff_list = (req, res)=>{
    console.log("Triggered function staff_list");;

    Staff.find({})
        .populate('courses')
        .exec((err, results)=>{
            if(err){
                console.log(results);
            } else{
                console.log(results);
                res.render('pages/viewStaff', {data: results});
            }
        });
};

exports.staff_detail = (req,res)=>{
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

