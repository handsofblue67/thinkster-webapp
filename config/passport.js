var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var User = mongoose.model('User');

// local strategy (logic) for validating user/password combo
passport.use(new LocalStrategy(
    function(username, password, done) {
        User.findOne({ username: username }, function (err, user){
            if(err) { return done(err); }

            if(!user) {
                return done(null, false, { message: 'Incorrect username.' });
            }

            if(!user.validPassword(password)){
                return done(null, false, { message: 'Incorrect password.' });
            }

            return done(null, user);
        });
    }
));