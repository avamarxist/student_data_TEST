const mongoose = require('mongoose');
const { genericCb } = require('../helpers');
const csv = require('fast-csv');

const Course = require('../mongo-schema/courseSchema');
const Student = require('../mongo-schema/studentSchema');
const Staff = require('../mongo-schema/staffSchema');

exports.upload_view = (req, res)=>{
    
    res.render('pages/mainImport', {});
}

exports.upload_post = (req, res)=>{

    if(!req.files){
        return res.status(400).send("No files were uploaded");
    }

    const sheet = req.files.file;

    const outputArray = [];

    csv
        .fromString(sheet.data.toString(), {
            headers: true,
            ignoreEmpty: true
        })
        .on("error", (err)=>{console.log(err)})
        .on("data", (data)=>{
            data['_id'] = new mongoose.Types.ObjectId;
            outputArray.push(data);
        })
        .on("end", ()=>{
            Student.create(outputArray, genericCb);
        })

        res.send(`${outputArray.length} entries added`)
}

const studentInfo = ()=>{};

const staffInfo = ()=>{};

const courseProgram = ()=>{};

const courseRosters = ()=>{};