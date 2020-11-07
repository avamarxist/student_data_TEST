const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const app = express();
const httpsServer = require('https');
const path = require('path');
require('dotenv').config();

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }))
const upload = multer();
app.use(upload.array()); 

// app.set('views', path.join(__dirname, './views/'));
app.set('view engine', 'ejs');

const db = require("./db");
const catalog = require("./routes/catalog");
const entries = require("./routes/entries");

app.use('/catalog', catalog);

app.use('/entries', entries);


const mongoose = require('mongoose');
const PORT = 3000;
const dbname = "student_data_TEST";
const url = "mongodb://localhost:27017";
const mongoOptions = {useNewUrlParser: true, useUnifiedTopology: true};

mongoose.connect(url+'/'+dbname, mongoOptions, (err, client)=>{
    if(err){
        console.log(err);
        process.exit(1);
    } else{
        app.listen(PORT, ()=>{
            console.log(`Connected to database on port ${PORT}`);
        })
    }
});


