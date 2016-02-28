var mongoose = require('mongoose');

var PostSchema = new mongoose.Schema({
	title: String,
	link: String,
    author: String,
	upvotes: {type: Number, default: 0},
	comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}],
    voters: { uppers: [String], downers: [String]},
	dateAdded: Date
});

PostSchema.methods.upvote = function(cb) {
    this.upvotes = this.voters.uppers.length  - this.voters.downers.length ;
	this.save(cb);
};

PostSchema.methods.downvote = function(cb) {
	this.upvotes = this.voters.uppers.length - this.voters.downers.length ;
	this.save(cb);
};

mongoose.model('Post', PostSchema);

