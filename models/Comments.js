var mongoose = require('mongoose');

var CommentSchema = new mongoose.Schema({
	body: String,
    author: String,
	upvotes: {type: Number, default: 0},
	post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
    voters: { uppers: [String], downers: [String]},
    dateAdded: Date
});

CommentSchema.methods.upvote = function(cb) {
    this.upvotes = this.voters.uppers.length  - this.voters.downers.length ;
	this.save(cb);
};

CommentSchema.methods.downvote = function(cb) {
    this.upvotes = this.voters.uppers.length  - this.voters.downers.length ;
    this.save(cb);
};

mongoose.model('Comment', CommentSchema);
