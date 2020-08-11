var mongoose = require("mongoose");
var paasportLocalMongoose = require("passport-local-mongoose");
var UserSchema = new mongoose.Schema({
	username: String,
	password: String
});

UserSchema.plugin(paasportLocalMongoose);

module.exports = mongoose.model("User",UserSchema);