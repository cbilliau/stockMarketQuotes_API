global.DATABASE_URL = 'mongodb://localhost/stockMarketApp-test';
process.env.NODE_ENV = 'development';

var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server.js');
var User = require('../models/users');

var should = chai.should();
var app = server.app;

chai.use(chaiHttp);

describe('Stock Market App', function() {
    before(function(done) {
        server.runServer(function() {
            User.create({
                username: 'Test User',
                password: 'password',
                stocks: ['AAPL', 'YHOO', 'FB']
            }, function() {
                done();
            });
        });
    });

    it('should list users on get', function(done) {
        chai.request(app)
            .get('/users')
            .end(function(err, res) {
                should.equal(err, null);
                res.should.have.status(200);
                res.should.be.json;
                res.body[0].should.be.a('object');
                res.body[0].should.have.property('_id');
                res.body[0].should.have.property('username');
                res.body[0].should.have.property('password');
                res.body[0].should.have.property('stocks');
                res.body[0].stocks.should.be.a('array');
                res.body[0].username.should.be.equal('Test User');
                res.body[0].password.should.be.equal('password');
                res.body[0].stocks[0].should.be.equal('AAPL');
                res.body[0].stocks[1].should.be.equal('YHOO');
                res.body[0].stocks[2].should.be.equal('FB');
                done();
            });
    });

    it('should add a user on post', function(done) {
        chai.request(app)
            .post('/users')
            .send({
                username: 'Test User2',
                password: 'password2',
                stocks: []
            })
            .end(function(err, res) {
                should.equal(err, null);
                res.should.have.status(201);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('_id');
                res.body.should.have.property('username');
                res.body.should.have.property('password');
                res.body.should.have.property('stocks');
                res.body.username.should.be.a('string');
                res.body.username.should.equal('Test User2');
                res.body.password.should.be.a('string');
                res.body.password.should.equal('password2');
                res.body.stocks.should.be.a('array');
                res.body.stocks.should.be.empty;
                done();
            });
    });
    it('should get a user on get ', function(done) {
        var targetID;
        chai.request(app)
            .get('/users')
            .end(function(err, res) {
                targetID = res.body[0]._id;
                chai.request(app)
                    .get('/users/' + targetID)
                    .end(function(err, res) {
                        should.equal(err, null);
                        res.should.have.status(200);
                        res.should.be.json;
                        res.body.should.be.a('object');
                        res.body.should.have.property('_id');
                        res.body.should.have.property('username');
                        res.body.should.have.property('password');
                        res.body.should.have.property('stocks');
                        res.body.stocks.should.be.a('array');
                        res.body.username.should.be.equal('Test User');
                        res.body.password.should.be.equal('password');
                        res.body.stocks[0].should.be.equal('AAPL');
                        res.body.stocks[1].should.be.equal('YHOO');
                        res.body.stocks[2].should.be.equal('FB');
                        done();
                    });
            });
    });

    it('should edit a stock on put', function(done) {
        var targetID,
            targetName,
            targetpassword,
            targetstocks;
        chai.request(app)
            .get('/users')
            .end(function(err, res) {
                targetID = res.body[1]._id;
                targetName = res.body[1].username;
                targetpassword = res.body[1].password;
                currentStocks = res.body[1].stocks;
                chai.request(app)
                    .put('/users/' + targetID)
                    .send({
                        '_id': targetID,
                        'username': targetName,
                        'password': targetpassword,
                        'stocks': currentStocks
                    })
                    .end(function(err, res) {
                        res.body.should.be.a('object');
                        res.body.should.have.property('stocks');
                        res.body.stocks.should.be.a('array');
                        res.body.stocks[0].should.be.equal('AAPL');
                        done();
                    });
            });
    });

    it('should delete a stock on delete', function(done) {
      var targetID;
      chai.request(app)
          .get('/users')
          .end(function(err, res) {
              targetID = res.body[1]._id;
              chai.request(app)
                  .delete('/users/' + targetID)
                  .end(function(err, res) {
                      res.should.have.status(200);
                      res.should.be.json;
                      res.body.should.be.a('string');
                      res.body.should.equal(targetID);
                      done();
                  });
          });

    });




    after(function(done) {
        User.remove(function() {
            done();
        });
    });
});
