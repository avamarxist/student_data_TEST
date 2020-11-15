const mongoose = require('mongoose');
const { genericCb } = require('../helpers');
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
            data['_id'] = new mongoose.Types.ObjectId;
            data['contacts'] = [data["contacts"]];
            outputArray.push(data);

            Student.updateOne({osis: data["osis"]}, data , {upsert: true, omitUndefined: true, overwrite: false});
        })
        .on("end", ()=>{
            res.send(outputArray);
            // Student.insertMany(outputArray, genericCb);
        });
}

const staffInfo = (req, res)=>{
    
    const newHeaders = ["lName", "fName", "status", "organization", "mainEmail", "phoneExt"];

    const outputArray = [];

    csv
    .parseString(req.file.buffer.toString(), {
        headers: newHeaders,
        renameHeaders: true,
        ignoreEmpty: true
    })
    .on("error", (err)=>{console.log(err)})
    .on("data", (data)=>{
    
        data['_id'] = new mongoose.Types.ObjectId;
        outputArray.push(data);

        Staff.updateOne({mainEmail: data["mainEmail"]}, data , {upsert: true, omitUndefined: true, overwrite: false});
    })
    .on("end", ()=>{
        res.send(outputArray);
    });
}

const courseProgram = (req, res)=>{
    res.send("Course program template not yet supported");
};

const courseRoster = (req, res)=>{
    res.send("Course roster template not yet supported")
};