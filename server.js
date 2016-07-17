var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');


var config = require('./config/config'); // Pulls in the url for the db based on what environ node running in.

var User = require('./models/users'); // Pulls in the schema mongoose will use

var app = express(); // The app object which will serve data to HTTP clients

app.use(bodyParser.json()); // Use bodyParser to handle json req bodies
app.use(express.static('public')); // Use static to serve static files

var runServer = function(callback) {
    // Connect to db
    mongoose.connect(config.DATABASE_URL, function(err) {
        if (err) {
            return callback(err);
        }
        // Rcv from app
        app.listen(config.PORT, function() {
            console.log("Listening on port" + config.PORT);
            if (callback) {
                callback();
            }
        });
    });
};
if (require.main === module) { // This trick makes file an executable script and a module
    // If scripts run directly the runServer called / If file 'required' from another file then server started at diff point
    runServer();
};

// Get all users
app.get('/users', function(request, response) {
    // 'User.find' is what sends a query to the db
    User.find(function(err, users) {
        if (err) {
            return response.status(500).json({
                message: 'Internal Server Error'
            });
        }
        // 'users' is now an object of all users
        response.json(users);
    })
});

// Create one user
app.post('/users', function(request, response) {
    User.create({
        username: request.body.username,
        password: request.body.password,
        stocks: request.body.stocks
    }, function(err, user) {
        if (err) {
            return response.status(500).json({
                message: 'Internal Server Error'
            });
        }
        response.status(201).json(user);
    });
});

// Get one user
app.get('/users/:id', function(request, response) {
    var targetID = request.params.id;
    User.findById(targetID, function(err, user) {
        if (err) {
            return response.status(500).json({
                message: 'Internal Server Error'
            });
        }
        // console.log(user);
        response.status(200).json(user);
    });
});

// Edit one user
app.put('/users/:id', function(request, response) {
    var id = request.body.id;
    var currentStocks = request.body.stocks
    var stockToPush = 'AAPL';
    request.body.stocks.push(stockToPush);
    var newStocks = request.body.stocks;
    User.findByIdAndUpdate(id, {
        stocks: newStocks
    }, function(err, data) {
        if (err) {
            return response.status(500).json({
                message: 'Internal Server Error'
            });
        }
        response.status(200).json({
            _id: id,
            stocks: newStocks
        });
    });
});

// Delete one user
app.delete('/users/:id', function(request, response) {
    var id = request.params.id;
    User.findByIdAndRemove(id, function(err) {
        if (err) {
            return response(500).json({
                message: 'Internal Server Error'
            });
        }
        response.status(200).json(id);
    });
});

exports.app = app;
exports.runServer = runServer;
