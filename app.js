const express = require('express');
const session = require('cookie-session');
const helmet = require('helmet');
const multer = require('multer');
const passport = require('passport');
require('./passport');
// const bodyParser = require('body-parser');
// const httpsServer = require('https');
// const path = require('path');

const app = express();

app.use(session({
  name: 'session',
  keys: ['key1', 'key2'],
  cookie: {
    secure: true,
    httpOnly: true,
    maxAge: 2*60*60*1000
  }
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }))
app.use(helmet());
const upload = multer();
app.use(upload.array()); 
app.use(passport.initialize());
app.use(passport.session());
app.set('view engine', 'ejs');

// set up primary routes

const auth = require('./routes/auth');
const catalog = require("./routes/catalog");
const entries = require("./routes/entries");
const importExport = require("./routes/import_export");
const home = require('./routes/home');

app.use('/auth', auth);
app.use('/catalog', catalog);
app.use('/entries', entries);
app.use('/sheets', importExport);
app.use('/', home);

// connect to DB and start server

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


