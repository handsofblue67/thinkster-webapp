/**
 * Created by michael on 2/24/16.
 */

var mongoose = require('mongoose');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');

var UserSchema = new mongoose.Schema({
    username: {type: String, lowercase: true, unique: true},
    hash: String,
    salt: String
    //posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post'}],
    //votedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post', vote: Number}],
    //votedComments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment', vote: Number}]
});

//UserSchema.methods.upvotePost = function(cb){
//
//};

//UserSchema.methods.upvoteComment = function(cb){
//
//};

UserSchema.methods.setPassword = function(password){
    this.salt = crypto.randomBytes(16).toString('hex');

    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
};

UserSchema.methods.validPassword = function(password) {
    var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');

    return this.hash === hash;
};

UserSchema.methods.generateJWT = function() {
    var today = new Date();
    var exp = new Date(today);
    exp.setDate(today.getDate() + 60);

    return jwt.sign({
        _id: this._id,
        username: this.username,
        exp: parseInt(exp.getTime() / 1000)
    }, 'SECRET');
};

mongoose.model('User', UserSchema);

