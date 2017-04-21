const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {BlogPosts} = require('./model');

BlogPosts.create(
		"100 Ways to Rocket JUMP",
		"This is the first blog post",
		"Sir Hoppington III",
		null
);


router.get('/',function(req, res){
	res.status(200).json(BlogPosts.get());
});

router.post('/', jsonParser, function(req, res) {
	const requiredFields = ['title', 'content', 'author'];
	let field = '';
	for (let i = 0; i < requiredFields.length; i++) {
		field = requiredFields[i];
		console.log(req.body);
		if (!(field in req.body)){
			const msg = `${field} not found in body`;
			return res.status(400).send(msg);
		}
	}
	let date = null;
	if (typeof req.body.publishDate !== 'undefined') {
		date = req.body.publishDate
	}

	const post = BlogPosts.create(req.body.title, req.body.content, req.body.author, date);
	res.status(201).json(post);
});

router.put('/:id', jsonParser, function(req, res) {
	console.log(req.params.id);
	const requiredFields = ['title', 'content', 'author'];
	let field = '';
	for (let i = 0; i < requiredFields.length; i++) {
		field = requiredFields[i];
		if (!(field in req.body)){
			const msg = `${field} not found in body`;
			return res.status(400).send(msg);
		}
	}
	for (let i = 0; i < BlogPosts.posts.length; i++) {
		if(req.params.id === BlogPosts.posts[i].id) {
			break;
		
		}
		else {
			const msg = `${req.params.id} does not exist`;
			return res.status(400).send(msg);
		}
	}
	res.status(204).json(BlogPosts.update(req.body));
});

router.delete('/:id', function(req,res) {
	for (let i = 0; i < BlogPosts.posts.length; i++) {
		if(req.params.id === BlogPosts.posts[i].id) {
			break;
		}
		else {
			const msg = `${req.params.id} does not exist`;
			return res.status(400).send(msg);
		}
	}
	res.status(204).json(BlogPosts.delete(req.params.id));
});

module.exports = router;
