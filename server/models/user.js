const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  username: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  }
});

//authenticate input against database
UserSchema.statics.authenticate = (email, password, callback) => {
  User.findOne({ email }).exec((err, user) => {
    if (err) {
      return callback(err);
    } else if (!user) {
      const err = new Error("User not found.");
      err.status = 401;
      return callback(err);
    }
    bcrypt.compare(password, user.password, (err, result) => {
      if (result === true) {
        return callback(null, user);
      } else {
        return callback();
      }
    });
  });
};

UserSchema.statics.addUser = async (data, callback) => {
  try {
    const { email, name } = data;
    const userWithSameEmail = await User.findOne({ email });
    const userWithSameUsername = await User.findOne({ name });
    if (userWithSameEmail) {
      return callback({ message: "User already exists with that email" });
    }   
    if (userWithSameUsername) {
      return callback({ message: 'Username already exists'})
    }   
    User.create(data, (err, user) => {
       return callback(err, user);
    });
  } catch(error){
    callback(error);
  }
};
  
//hashing a password before saving it to the database
UserSchema.pre("save", function(next) {
  const user = this;
  bcrypt.hash(user.password, 10, function(err, hash) {
    if (err) {
      return next(err);
    }
    user.password = hash;
    next();
  });
});

var User = mongoose.model("User", UserSchema);
module.exports = User;
