var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Post = mongoose.model('Post');
var Comment = mongoose.model('Comment');

/*gets all posts*/
router.get('/',function(req, res, next){
	Post.find(function(err, posts){
		if(err){ return next(err); }		
		res.json(posts);
	});
});

/*write a post*/
router.post('/',function(req, res, next){
	var post = new Post(req.body);
	post.save(function(err, post){
		if(err){ return next(err); }		
		res.json(post);
	});
});

/*gets a post by ID*/
router.get('/:post',function(req, res){
	req.post.populate('comments',function(err, post){
		res.json(post);
	});	
});

/*Add a vote to a post*/
router.put('/:post/upvote', function(req, res, next){
	req.post.upvote(function(err, post){
		if(err){ return next(err); }
		res.json(post);
	});
});

/*add a comment to a post*/
router.post('/:post/comments', function(req, res, next) {
  var comment = new Comment(req.body);
  comment.post = req.post;

  comment.save(function(err, comment){
    if(err){ return next(err); }

    req.post.comments.push(comment);
    req.post.save(function(err, post) {
      if(err){ return next(err); }

      res.json(comment);
    });
  });
});

/*Add a vote to a post*/
router.put('/:post/comments/:comment/upvote', function(req, res, next){
	req.comment.upvote(function(err, comment){
		if(err){ return next(err); }
		res.json(comment);
	});
});

/*
 * Creando la magia
 * It's used to find automatically when sended by param to a route
 */
router.param('post',function(req, res, next, id){
	var query = Post.findById(id);
	query.exec(function(err, post){
		if(err){ return next(err); }
		if(!post){ return next(new Error("can't find post"));}

		req.post = post;
		return next();
	});
});

/*
 * Creando la magia
 * It's used to find automatically when sended by param to a route
 */
router.param('comment',function(req, res, next, id){
	var query = Comment.findById(id);
	query.exec(function(err, comment){
		if(err){ return next(err); }
		if(!comment){ return next(new Error("can't find comment"));}

		req.comment = comment;
		return next();
	});
});

module.exports = router;