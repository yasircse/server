const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

// DB Setup
mongoose.connect('mongodb://localhost:auth/auth');

// define our model
const userSchema = new Schema({
    email: { type: String, unique: true, lowercase: true },
    password: String
});
// on the save hook, encrypt the password.
//before saving a model run this function.
userSchema.pre('save', function (next) {
    //get access to use model.
    const user = this;
    //1. first we generate a salt. then run call back.
    bcrypt.genSalt(10, function (err, salt) {
        if (err) { return next(err); }
        // after the salt generated hash(encrypt) the password using salt
        bcrypt.hash(user.password, salt, null, function (err, hash) {
            if (err) { return next(err); }
            //overite plain text password with encrypted password.s
            user.password = hash;
            //next means go ahead and save the model
            next();
        });
    });
});

// lets compare the password
userSchema.methods.comparePassword = function(candidatePassword, callback){
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch){
        if(err){return callback(err);}
        callback(null,isMatch);
    });
}
// create the model class

const ModelClass = mongoose.model('user', userSchema);
// export the model
module.exports = ModelClass;