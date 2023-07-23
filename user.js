const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
require ('dotenv'). config ();
const DBurl = process.env.USER_DB;

mongoose.connect(DBurl,{
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Create Model
const Schema = mongoose.Schema;

const User = new Schema({
  username: String,
  password: String
});
// Export Model
User.plugin(passportLocalMongoose);

module.exports = mongoose.model('userData', User, 'userData');