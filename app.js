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

// const db = require("./db");
const catalog = require("./routes/catalog");
const entries = require("./routes/entries");
const importExport = require("./routes/import_export");

app.use('/catalog', catalog);

app.use('/entries', entries);

app.use('/sheets', importExport);

const mongoose = require('mongoose');
const PORT = process.env.PORT || 3000;
const url = "mongodb+srv://" + process.env.DB_HOST + process.env.DB_PORT + process.env.DB_NAME + process.env.DB_QUERY;
console.log(url);
// const pass = process.env.DB_PWD;
// console.log (`Pass: ${pass}  type: ${typeof(pass)}`);
const mongoOptions = {user: process.env.DB_USER, pass: process.env.DB_PWD, useNewUrlParser: true, useUnifiedTopology: true};

mongoose.connect(url, mongoOptions, (err, client)=>{
    if(err){
        console.log(err);
        process.exit(1);
    } else{
        app.listen(PORT, ()=>{
            console.log(`Connected to database on port ${PORT}`);
        })
    }
});


