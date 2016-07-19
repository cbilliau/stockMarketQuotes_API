var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var config = require('./config/config'); // Pulls in the url for the db based on what environ node running in.
var User = require('./models/users'); // Pulls in the schema mongoose will use
var bcrypt = require('bcrypt');
var passport = require('passport'); // For auth
var BasicStrategy = require('passport-http').BasicStrategy; // For auth

var app = express(); // The app object which will serve data to HTTP clients

// App use...
app.use(bodyParser.json()); // Use bodyParser to handle json req bodies
app.use(express.static('public')); // Use static to serve static files
app.use(passport.initialize()); // Use passport to authorize user

// Strategy for hidding endpoint from no-users
var strategy = new BasicStrategy(function(username, password, callback) {
    User.findOne({
        username: username
    }, function(err, user) {
        if (err) {
            callback(err);
            return;
        }

        if (!user) {
            return callback(null, false, {
                message: 'Incorrect username.'
            });
        }

        user.validatePassword(password, function(err, isValid) {
            if (err) {
                return callback(err);
            }

            if (!isValid) {
                return callback(null, false, {
                    message: 'Incorrect password.'
                });
            }
            return callback(null, user);
        });
    });
});
passport.use(strategy);

// Server
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
app.get('/users', passport.authenticate('basic', {
    session: false
}), function(request, response) {
    // 'User.find' is what sends a query to the db
    User.find(function(err, users) {
        if (err) {
            return response.status(500).json({
                message: 'Internal Server Error'
            });
        }
        // 'users' is now an object of all users
        response.json({});
    })
});

// Create one user
app.post('/users', function(req, res) {
    console.log(req.body)
    if (!req.body) {
        return res.status(400).json({
            message: "No request body"
        });
    }

    if (!('username' in req.body)) {
        return res.status(422).json({
            message: 'Missing field: username'
        });
    }

    var username = req.body.username;

    if (typeof username !== 'string') {
        return res.status(422).json({
            message: 'Incorrect field type: username'
        });
    }

    username = username.trim();

    if (username === '') {
        return res.status(422).json({
            message: 'Incorrect field length: username'
        });
    }

    if (!('password' in req.body)) {
        return res.status(422).json({
            message: 'Missing field: password'
        });
    }

    var password = req.body.password;

    if (typeof password !== 'string') {
        return res.status(422).json({
            message: 'Incorrect field type: password'
        });
    }

    password = password.trim();

    if (password === '') {
        return res.status(422).json({
            message: 'Incorrect field length: password'
        });
    }
    // Ecnryption
    // Generate salt
    bcrypt.genSalt(10, function(err, salt) {
        if (err) {
            return res.status(500).json({
                message: 'Internal server error'
            });
        }

        bcrypt.hash(password, salt, function(err, hash) {
            if (err) {
                return res.status(500).json({
                    message: 'Internal server error'
                });
            }

            var user = new User({
                username: username,
                password: hash,
                stocks: []
            });

            user.save(function(err) {
                if (err) {
                    return res.status(500).json({
                        message: 'Internal server error'
                    });
                }

                return res.status(201).json({});
            });
        });
    });
});

// Get one user
app.get('/users/:username', passport.authenticate('basic', {
    session: false
}), function(request, response) {
    var userName = request.params.username;
    User.findOne({
        'username': userName
    }, function(err, user) {
        if (err) {
            return response.status(500).json({
                message: 'Internal Server Error'
            });
        }
        response.status(200).json(user);
    });
});

// Add stock to user
app.put('/users/:id', passport.authenticate('basic', {
    session: false
}), function(request, response) {
    var id = request.user._id;
    console.log(id);
    console.log(request.body);
    var newStockArr = request.body.stocks;
    User.findByIdAndUpdate(id, {
        stocks: newStockArr
    }, function(err, data) {
        if (err) {
            return response.status(500).json({
                message: 'Internal Server Error'
            });
        }
        response.status(200).json({
            _id: id,
            stocks: newStockArr
        });
    });
});

// Delete one stock for user
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
