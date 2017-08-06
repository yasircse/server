const User = require('../models/user');
const jwt = require('jwt-simple');
const config = require('../config');

function tokenForUser(user){
    const timeStamp = new Date().getTime();
    return jwt.encode({sub:user.id,iat:timeStamp}, config.secret);
}

exports.signin = function(req, res, next){
    // at this poit user has already had their email and password auth'does
    //we just need to give them token
    // current user can be access req.user because passport.js is holding it.
    res.send({token:tokenForUser(req.user)});
};
exports.signup = function(req, res, next){
    // read email and password supplied by user
    const email=req.body.email;
    const password = req.body.password;
    // to check both email and password are provided
    if(!email || !password){
        return res.status(422).send({error:'Please provide email and password'});
    }

    // see if user with supplied email id exist
User.findOne({email:email}, function(err, existingUser){
if(err){return next(err);}
//if user with email does exist..through an error
if(existingUser){
    res.status(422).send({email:'Email is already in use'});
}
//if user with email does not exist, then create and save the user.
const user = new User({
    email:email,
    password:password
})
user.save(function(err){
    if(err){return next(err);}
    // respond to request indicating user created and saved
    res.json({token:tokenForUser(user)});
});
});
}