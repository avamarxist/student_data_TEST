const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const Staff = require('./mongo-schema/staffSchema');
const User = require('./mongo-schema/userSchema');

passport.serializeUser(function(user, done) {
    done(null, user);
  });
  
passport.deserializeUser(function(user, done) {
    done(null, user);
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
                console.log("user found");
                return done(err, user);

            } else{
                console.log("user not found, looking for staff");
                Staff.findOne({mainEmail: profile.email }, (err, result)=>{
                    console.log(`Staff: `)
                    if(result){
                        console.log("staff found, making a user account");
                        new User({
                            google_id: profile.id,
                            staff_id: result._id,
                            role: "admin"
                        }).save().then(newUser=>{
                            console.log("user created");
                            done(null, newUser);
                        });
                    }
                })
            };
        // return done(null, profile);
        });
    }
));