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

PostSchema.methods.upvote = function(cb, upper) {
	this.upvotes += 1;
	this.save(cb);
};

PostSchema.methods.downvote = function(cb, downer) {
	this.upvotes -= 1;
	this.save(cb);
};

PostSchema.methods.changeToUpvote = function(cb) {
    this.upvotes += 2;
    this.save(cb);
};

PostSchema.methods.changeToDownvote = function(cb) {
    this.upvotes -= 2;
    this.save(cb);
};
mongoose.model('Post', PostSchema);

