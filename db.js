const mongoose = require('mongoose');
const tunnel = require('tunnel-ssh');

// var config = {
//     username: process.env.SSH_USER,
//     host: process.env.SSH_HOST,

//     dstHost: process.env.DB_HOST,
//     dstPort: process.env.DB_PORT,
//     password:'mypassword',
// };

var server = tunnel(config, function (error, server) {
    if(error){
        console.log("SSH connection error: " + error);
    }
    mongoose.connect('mongodb://localhost:27000/mydbname');

    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'DB connection error:'));
    db.once('open', function() {
        // we're connected!
        console.log("DB connection successful");
        // console.log(server);
    });
});

module.exports = {connect, getDB};