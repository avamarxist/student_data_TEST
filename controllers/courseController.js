const { set } = require('mongoose');
const { genericCb } = require('../helpers');
const Course = require('../mongo-schema/courseSchema');
const Student = require('../mongo-schema/studentSchema');
const Staff = require('../mongo-schema/staffSchema');

exports.course_list_full = (req, res)=>{
    console.log("Triggered function course_list_full");

    Course.find({}).populate('staff', 'lName fName').exec((err, results)=>{
        if(err){
            console.log(err);
            return err;
        } else{
            // results.forEach((x)=>{console.log(x["staff"])})
            res.render('pages/viewCourse', {data: results});
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

exports.course_addNew_get = (req, res)=>{
    

    const queries = async ()=>{
        let [activeStaff, activeStudents] = await Promise.all([Staff.find({status:"active"}, '_id lName fName'), Student.find({status:"active"}, '_id osis lName fName')]);
        return {activeStaff, activeStudents};
    }

    queries().then((results)=>{
        res.render('pages/addCourse', {data: results});
    })
}

exports.course_addNew_post = (req, res)=>{
    console.log("Triggered function course_addNew_post");

    const userInput = req.body;
    console.log("raw input: ");
    console.log(userInput);
    const staffIdArray = [userInput["staff"]];
    
    // userInput["staff"] = userInput["staff"].forEach((id)=>{return {staff_id: id}});
    // console.log("get staff ids: ");
    // console.log(userInput);

    const numStudents = userInput["numStudents"];
    delete userInput.numStudents;
    console.log("final:");
    console.log(userInput);

    const newCourse = new Course(userInput);

    if(staffIdArray.length>0){
        staffIdArray.forEach((x) => {
            Staff.findByIdAndUpdate(x, {$push: {courses: newCourse.id}}, (err, result)=>{
                if(err){ console.log(err);} 
            })
        });
    }

    newCourse.save((err, result)=>{
        if(err){
            console.log(err);
        } else{
            let url = '/catalog/course/add/roster/' + result._id + '?num=' + numStudents;
            res.redirect(url);
        }
    })
};

exports.course_addStudents_get = (req, res)=>{
    const numEntries = req.query.num;
    const courseId = req.params.id;

    Student.find({status: "active"}).exec((err, result)=>{
        if(err){console.log(err)}
        else{
            res.render('pages/addCourseRoster', {data: {id: courseId, num: numEntries, activeStudents: result}});
        }
    });


}

exports.course_addStudents_post = (req, res)=>{
    console.log("Triggered function course_addStudents_put")
    const userInput = req.body;
    const courseId = req.params.id;

    const entries = Object.values(userInput);
    console.log(entries);

    // STEP 1: push codes to Course
    
    let updatedCodes;
    if(entries.length>0){
        let codeArray = entries.map((x)=>{return x[0]}).filter((x)=>{return x!=""});
        updatedCodes = [...new Set(codeArray)];
    } else{ updatedCodes = []}

    if(updatedCodes.length>0){
        updatedCodes.forEach((code)=>{
            Course.findByIdAndUpdate(courseId, {$addToSet: {codes: code}}).exec(genericCb);
        });
    }
    
    
    //STEP 2: push course to students

    const studentIdArray = entries.map((x)=>{return x[1]}).filter((x)=>{return x!=""});
    
    if(studentIdArray.length>0){
        studentIdArray.forEach((s)=>{
            Student.findByIdAndUpdate(s, {$addToSet: {courses: courseId}}).exec(genericCb);   
        });
    }


    //STEP 3: push students to Course

    let entriesObj = [];
    for (let entry of entries){
        entriesObj.push({
            student_id: entry[1],
            code: entry[0],
            status: "active"
        });
    }

    console.log(entriesObj);

    if(entriesObj.length>0){
        entriesObj.forEach((entry)=>{
            Course.findByIdAndUpdate(courseId, {$addToSet: {students: entry}}).exec(genericCb);
        });
    }

    Course.findById(courseId).exec((err, result)=>{
        if(err){console.log(err)}
        else{ res.json(result)}
    });
}

exports.course_update = (req,res)=>{
    res.send('Update class not yet implemented');
};

