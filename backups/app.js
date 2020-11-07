const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());
const path = require('path');

const db = require("./db");
const students = require("./routes/students");

const PORT = 3000;

app.use('/students', students);

db.connect((err)=>{
    if(err){
        console.log('Unable to connect to database ');
        process.exit(1);
    } else{
        app.listen(PORT,()=>{
            console.log('Connected to db, app listening on port ' + PORT);
        })
    }
});