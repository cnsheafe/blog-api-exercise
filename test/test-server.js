const chai = require('chai');
const chaiHttp = require('chai-http');

const {app, runServer, closeServer} = require('../server');

const should = chai.should();
chai.use(chaiHttp);

describe('Blog Posts', function() {
  before(function() {
    return runServer();
  });

  after(function() {
    return closeServer();
  });

  it('should return, if param id provided, a single post on GET. Otherwise, return  a list of posts',function() {
    let paramId;
    return chai.request(app)
    .get('/blog-posts')
    .then(function(res) {
      res.should.have.status(200);
      res.should.be.json;
      res.body.should.be.a('array');

      paramId = res.body[0].id;

      return chai.request(app)
      .get(`/blog-posts/${paramId}`)
      .then(function(res) {
        res.should.have.status(200);
        res.should.be.json;
        res.should.be.a('object');
        const expectedKeys = ['id', 'title', 'author', 'content','publishDate' ];
        res.body.should.include.keys(expectedKeys);
      });
    });
  });

  it('should add a post on POST', function () {
    const newPost = {
      title: 'demo post',
      author: 'me',
      content: 'beeeeeeess'
    };

    const expectedKeys = ['id', 'title', 'author', 'content','publishDate' ];
  
    return chai.request(app)
    .post('/blog-posts')
    .send(newPost)
    .then(function(res) {
      res.should.have.status(201);
      res.should.be.json;
      res.body.should.be.a('object');
      res.body.should.include.keys(expectedKeys);
      res.body.should.deep.equal(Object.assign(newPost, {id: res.body.id, publishDate: res.body.publishDate}));
    });
  });

  it('should update a post on PUT', function () {
    const updatedPost = {
      title: 'new title',
      author: 'same author',
      content: 'my content'
    };

    return chai.request(app)
    .get('/blog-posts')
    .then(function(res) {
      updatedPost.id = res.body[0].id;
      return chai.request(app)
      .put(`/blog-posts/${updatedPost.id}`)
      .send(updatedPost);
    });
  });

  it('should delete a post on DELETE', function () {
    return chai.request(app)
    .get('/blog-posts')
    .then(function(res){
      return chai.request(app).delete(`/blog-posts/${res.body[0].id}`);
    }).then(res => res.should.have.status(204));
  });
});
