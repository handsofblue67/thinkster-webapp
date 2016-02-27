var mongoose = require('mongoose');

var CommentSchema = new mongoose.Schema({
	body: String,
    author: String,
	upvotes: {type: Number, default: 0},
	post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
    voters: { uppers: [String], downers: [String]}
});

CommentSchema.methods.upvote = function(cb) {
	this.upvotes += 1;
	this.save(cb);
};

CommentSchema.methods.changeToUpvote = function(cb) {
    this.upvotes += 2;
    this.save(cb);
};

CommentSchema.methods.changeToDownvote = function(cb) {
    this.upvotes -= 2;
    this.save(cb);
};

CommentSchema.methods.downvote = function(cb) {
    this.upvotes -= 1;
    this.save(cb);
};

mongoose.model('Comment', CommentSchema);
