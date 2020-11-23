const express = require('express');
const session = require('express-session');
const helmet = require('helmet');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);
const multer = require('multer');
const passport = require('passport');
require('./passport');

const app = express();

app.use(session({
  secret: 'Where no man has gone before',
  name: 'session',
  store: new MongoStore({mongooseConnection: mongoose.connection}),
  cookie: {
    // secure: true,
    httpOnly: true,
    maxAge: 2*60*60*1000,
    saveUnintialized: false
  }
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }))
app.use(helmet());
// const upload = multer();
// app.use(upload.array()); 
app.use(passport.initialize());
app.use(passport.session());

app.use(function (err, req, res, next) {
    console.log('This is the invalid field ->', err.field)
    next(err)
  })

// app.set('views', path.join(__dirname, './views/'));
app.set('view engine', 'ejs');

// set up primary routes

const auth = require('./routes/auth');
const records = require("./routes/records");
const entries = require("./routes/entries");
const updates = require("./routes/updates");
const home = require('./routes/home');

app.use('/auth', auth);
app.use('/records', records);
app.use('/entries', entries);
app.use('/updates', updates);
app.use('/', home);

// connect to DB and start server

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


