const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const Staff = require('./mongo-schema/staffSchema');
const User = require('./mongo-schema/userSchema');

passport.serializeUser(function(user, done) {
    done(null, user._id);
  });
  
passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:3000/auth/google/callback'
},
    (accessToken, refreshToken, profile, done)=>{
        console.log(profile);
        User.findOne({google_id: profile.id}, (err, user)=>{
            if(user){
                if(err){console.log(`Error: ${err}`);}
                console.log(`User: ${user}`);
                return done(err, user);

            } else{
                let profileEmail = profile.emails[0].value;
                let emailRegEx = new RegExp(profileEmail, 'i');
                console.log(`user not found, looking for staff with email ${profileEmail}`);
                Staff.findOne({mainEmail: emailRegEx }).exec((err, result)=>{
                    if(result){
                        console.log(`mail matches ${result.lName}, ${result.fName}, making a user account`);
                        new User({
                            google_id: profile.id,
                            staff_id: result._id,
                            role: "admin"
                        }).save().then(newUser=>{
                            console.log("user created");
                            done(null, newUser);
                        });
                    } else{ 
                        console.log(`No matching staff matching ${profileEmail}, contact administrator`);
                        return done(err, null);
                    }
                })
            }
            // return done(null, profile);
        });
    }
));

