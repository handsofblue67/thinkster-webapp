/**
 * Created by michael on 2/24/16.
 */

var mongoose = require('mongoose');
var crypto = require('crypto');

var UserSchema = new mongoose.Schema({
    username: {type: String, lowercase: true, unique: true},
    hash: String,
    salt: String
});

mongoose.model('User', UserSchema);
