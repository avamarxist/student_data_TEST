const mongoose = require('mongoose');
const { genericCb, getYearTerm } = require('../helpers');
const csv = require('fast-csv');
const fs = require('fs');


const Course = require('../mongo-schema/courseSchema');
const Student = require('../mongo-schema/studentSchema');
const Staff = require('../mongo-schema/staffSchema');

exports.upload_view = (req, res)=>{
    
    res.render('pages/mainImport', {});
}

exports.upload_post = (req, res, next)=>{
    console.log("Triggered function upload_post");

    if(!req.file){
        return res.status(400).send("No files were uploaded");
    }

    const template = req.body.templateType;

    if(template == "studentInfo"){ studentInfo(req, res);}
    else if(template == "staffInfo"){ staffInfo(req, res);}
    else if(template == "courseProgram"){ courseProgram(req, res);}
    else if(template == "courseRoster"){ courseRoster(req, res);}
    else{res.send("Template not supported");}

}

const studentInfo = (req, res)=>{
    
    const newHeaders = ["osis", "lName", "fName", "status", "level", undefined, "gradCohort", "learningCohort", 
        "doeEmail", "contacts", "rel1lName", "rel1fName", "rel1relation", "rel1contact", "rel2lName", "rel2fName", "rel2relation", "rel2contact"];

    const outputArray = [];

    csv
        .parseString(req.file.buffer.toString(), {
            headers: newHeaders,
            renameHeaders: true,
            ignoreEmpty: true
        })
        .on("error", (err)=>{console.log(err)})
        .on("data", (data)=>{

            let r1Headings = ["rel1lName", "rel1fName", "rel1relation", "rel1contact"];
            let r2Headings = ["rel2lName", "rel2fName", "rel2relation", "rel2contact"];

            let r1 = r1Headings.map((x)=>{return data[x]}).filter(x => x!="");
            let r2 = r2Headings.map((x)=>{return data[x]}).filter(x => x!="");

            let relations = [];

            if(r1.length>0){
                relations.push({lName: r1[0], fName: r1[1], relation: r1[2], contact: r1[3]});
            }
            if(r2.length>0){
                relations.push({lName: r2[0], fName: r2[1], relation: r2[2], contact: r2[3]});
            }

            r1Headings.forEach((x)=> delete data[x]);
            r2Headings.forEach((x)=> delete data[x]);
            data['relations'] = relations;
            // data['_id'] = new mongoose.Types.ObjectId;
            data['contacts'] = [data["contacts"]];
            outputArray.push(data);

            Student.updateOne({osis: data["osis"]}, data , {upsert: true, overwrite: false}).exec(genericCb);
        })
        .on("end", ()=>{
            res.send("Upload successful");
            // res.send(outputArray);
            // Student.insertMany(outputArray, genericCb);
        });
}

const staffInfo = (req, res)=>{
    
    const newHeaders = ["lName", "fName", "roles", "mainEmail", "room", "phoneExt", "organization", "status"];

    const outputArray = [];

    csv
    .parseString(req.file.buffer.toString(), {
        headers: newHeaders,
        renameHeaders: true,
        ignoreEmpty: true
    })
    .on("error", (err)=>{console.log(err)})
    .on("data", (data)=>{
    
        // data['_id'] = new mongoose.Types.ObjectId;
        outputArray.push(data);
        data['courses'] = [];
        data['comments'] = [];

        Staff.updateOne({mainEmail: data["mainEmail"]}, data , {upsert: true, overwrite: false}).exec(genericCb);
    })
    .on("end", ()=>{
        res.send(outputArray);
    });
}

const courseProgram = (req, res)=>{
    const newHeaders = ["courseName", "code", "section", "lName", "startDate", "endDate", "blah0", "blah1", "blah2", "special"];

    const outputArray = [];

    csv
    .parseString(req.file.buffer.toString(), {
        headers: newHeaders,
        renameHeaders: true,
        ignoreEmpty: true
    })
    .on("error", (err)=>{console.log(err)})
    .on("data", async (data)=>{
        // remove unnecessary columns + add empty ones
        for(let i = 0; i <=2; i++){ delete data['blah'+i]; }
        data['students'] = []
        // convert from staff last name to staff id
        const staffNameRE = new RegExp(data["lName"], 'i');
        const staff = await Staff.findOne({lName: staffNameRE}, 'id');
        delete data['lName']; 
        // detect and add school year and term
        let startDate = new Date(data['startDate']); 
        let endDate = new Date(data['endDate']); 
        data['schoolYear'] = getYearTerm(startDate)[0];
        data['term'] = getYearTerm(startDate)[1];
        data['status'] = (endDate > new Date()) ? 'active' : 'inactive';
        data['startDate'] = startDate;
        data['endDate'] = endDate;

        if(data['schoolYear'] && data['term']){           

            let filter = {schoolYear: data['schoolYear'], term: data['term'], code: data['code'], section: data['section']};
            let course = await Course.findOneAndUpdate(filter, data, {new: true, upsert: true});
            Staff.findByIdAndUpdate(staff._id, {$addToSet: {courses: course._id}}, {new: true}).exec((err, result)=>{
                if(err) { console.log(err) }
            });
        }
    })
    .on("end", ()=>{
        res.render('pages/mainImport', {});
    });
};

const courseRoster = (req, res)=>{
    const newHeaders = ["code", "section", "blah0", "osis", "staffName", "startDate", "blah1", "blah2", "period"];

    csv
    .parseString(req.file.buffer.toString(), {
        headers: newHeaders,
        renameHeaders: true,
        ignoreEmpty: true
    })
    .on("error", (err)=>{console.log(err)})
    .on("data", async (data)=>{
        //remove extraneous columns
        for(let i = 0; i <=2; i++){ delete data['blah'+i]; }
        // get school year and term if available, or establish based on date of entry
        let [thisYear, thisTerm] = getYearTerm(new Date(data.startDate));
        let [nowYear, nowTerm] = getYearTerm(new Date());
        let year = thisYear ? thisYear : nowYear;
        let term = thisTerm ? thisTerm : nowTerm;
        // convert from staff last name to staff id
        const staffNameRE = new RegExp(data["staffName"], 'i');
        const staff = await Staff.findOne({lName: staffNameRE}, 'id');
        delete data['staffName']; 

        let student = await Student.findOne({osis: data['osis']});
        let studentObj = {};
        if(student){
            studentObj = {
                student_id: student._id, 
                status: 'active', 
                startDate: data['startDate'], 
            };
        }
        
        let courseData = {
            schoolYear: year,
            term: term,
            status: 'active',
            code: data['code'],
            courseName: null,
            classAlias: null,
            section: data['section'],
            period: data['period'],
            special: null,
            startDate: null,
            endDate: null
        }

        // console.log(studentObj);

        let courseFilter = {code: courseData.code, section: courseData.section, schoolYear: courseData.schoolYear, term: courseData.term};
        let course = await Course.findOneAndUpdate(courseFilter, {$set: courseData, $addToSet: {students: studentObj, staff: staff._id}}, {upsert: true, new: true, overwrite: false, omitUndefined: true} );
        let courseObj = {
            courseId: course._id,
            status: 'active'
        }
        
        if(student){
            Student.findOneAndUpdate({_id: student._id, 'courses.courseId': {$ne: courseObj.courseId}}, {$push: {courses: courseObj}}).exec((err, result)=>{
                if(err) {console.log(err)}
            });
        }

        if(staff){
            Staff.findByIdAndUpdate(staff._id, {$addToSet: {courses: course._id}}).exec((err, result)=>{
                if(err) { console.log(err) }
            });
        }
    })
    .on("end", ()=>{
        res.render('pages/mainImport');
    });
};