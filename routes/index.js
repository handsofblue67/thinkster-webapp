var mongoose = require('mongoose');
var express = require('express');
var passport = require('passport');
var jwt = require('express-jwt');

// create express router middleware
var router = express.Router();

// create jwt middleware
var auth = jwt({secret: 'SECRET', userProperty: 'payload'});

var User = mongoose.model('User');
var Post = mongoose.model('Post');
var Comment = mongoose.model('Comment');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.param('post', function(req, res, next, id) {
    var query = Post.findById(id);

    query.exec(function (err, post){
        if (err) { return next(err); }
        if (!post) { return next(new Error('can\'t find post')); }

        req.post = post;
        return next();
    });
});

router.param('comment', function(req, res, next, id) {
    var query = Comment.findById(id);

    query.exec(function (err, comment){
        if (err) { return next(err); }
        if (!comment) { return  next(new Error('can\'t find comment')); }

        req.comment = comment;
        return next();
    });
});

router.get('/posts', function(req, res, next) {
    Post.find(function(err, posts) {
        if(err) { return next(err); }

        res.json(posts);
    });
});

router.post('/posts', auth, function(req, res, next) {
    var post = new Post(req.body);
    post.author = req.payload.username;
    post.save(function(err, post){
        if(err){ return next(err); }

        res.json(post);
    });
});

router.get('/posts/:post', function(req, res) {
    req.post.populate('comments', function(err, post) {
        if (err) { return next(err); }

        res.json(post);
    });
});

router.put('/posts/:post/upvote', auth, function(req, res, next) {
    var user = req.payload.username;
    var revoter = req.post.voters.uppers.indexOf(user);
    console.log(revoter);
    if (revoter === -1) {
        var revoter = req.post.voters.downers.indexOf(user);
        if (revoter !== -1) {
            console.log('changed');
            req.post.voters.downers.splice(revoter, 1);
            req.post.voters.uppers.push(user);
            req.post.upvote(function (err, post) {
                if (err) { return next(err); }
                res.json(post);
            });
        } else {
            console.log('added');
            req.post.voters.uppers.push(user);
            req.post.upvote(function (err, post) {
                if (err) { return next(err); }
                res.json(post);
            });
        }
    }
});

router.put('/posts/:post/downvote', auth, function(req, res, next) {
    var user = req.payload.username;
    var revoter = req.post.voters.downers.indexOf(user);
    console.log(revoter);
    if (revoter === -1) {
        var revoter = req.post.voters.uppers.indexOf(user);
        if (revoter !== -1) { // user is changing vote
            console.log('changed');
            req.post.voters.uppers.splice(revoter, 1);
            req.post.voters.downers.push(user);
            req.post.downvote(function (err, post) {
                if (err) { return next(err); }
                res.json(post);
            });
        } else {
            console.log('added');
            req.post.voters.downers.push(user);
            req.post.downvote(function (err, post) {
                if (err) { return next(err); }
                res.json(post);
            });
        }
    }
});

router.post('/posts/:post/comments', auth, function(req, res, next) {
    var comment = new Comment(req.body);
    comment.post = req.post;
    comment.author = req.payload.username;

    comment.save(function(err, comment){
        if(err){ return next(err); }

        req.post.comments.push(comment);
        req.post.save(function(err, post) {
            if(err){ return next(err); }

            res.json(comment);
        });
    });
});

router.put('/posts/:post/comments/:comment/upvote', auth, function(req, res, next) {
    var user = req.payload.username;
    var revoter = req.comment.voters.uppers.indexOf(user);
    console.log(revoter);
    if (revoter === -1) {
        var revoter = req.comment.voters.downers.indexOf(user);
        if (revoter !== -1) { // user is changing vote
            console.log('changed');
            req.comment.voters.downers.splice(revoter, 1);
            req.comment.voters.uppers.push(user);
            req.comment.upvote(function (err, comment) {
                if (err) { return next(err); }
                res.json(comment);
            });
        } else {
            console.log('added');
            req.comment.voters.uppers.push(user);
            req.comment.upvote(function (err, comment) {
                if (err) { return next(err); }
                res.json(comment);
            });
        }
    }
});

router.put('/posts/:post/comments/:comment/downvote', auth, function(req, res, next) {
    var user = req.payload.username;
    var revoter = req.comment.voters.downers.indexOf(user);
    console.log(revoter);
    if (revoter === -1) {
        var revoter = req.comment.voters.uppers.indexOf(user);
        if (revoter !== -1) { // user is changing vote
            console.log('changed');
            req.comment.voters.uppers.splice(revoter, 1);
            req.comment.voters.downers.push(user);
            req.comment.downvote(function (err, comment) {
                if (err) { return next(err); }
                res.json(comment);
            });
        } else {
            console.log('added');
            req.comment.voters.downers.push(user);
            req.comment.downvote(function (err, comment) {
                if (err) { return next(err); }
                res.json(comment);
            });
        }
    }
});

router.post('/register', function(req, res, next){
    if(!req.body.username || !req.body.password){
        return res.status(400).json({message: 'Please fill out all fields'});
    }

    var user = new User();

    user.username = req.body.username;

    user.setPassword(req.body.password);

    user.save(function(err){
        if(err) { return next(err); }

        return res.json({token: user.generateJWT()});
    });
});

router.post('/login', function(req, res, next){
    if(!req.body.username || !req.body.password){
        return res.status(400).json({message: 'Please fill out all fields'});
    }

    passport.authenticate('local', function(err, user, info){
        if(err){ return next(err); }

        if(user){
            return res.json({token: user.generateJWT()});
        } else {
            return res.status(401).json(info);
        }
    })(req, res, next);
});

module.exports = router;

