const mongoose = require('mongoose');

const dbname = "student_data_TEST";
const url = "mongodb://localhost:27017";
const mongoOptions = {useNewUrlParser: true, useUnifiedTopology: true};

const connect = mongoose.connect(url+'/'+dbname, mongoOptions);

const db = mongoose.connection;

const getDB = ()=>{ return state.db; };

module.exports = {connect, getDB};