var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
		password: { type: String, required: true},
		stocks: { type: Array, required: false}
});

var User = mongoose.model('User', UserSchema);

module.exports = User;
