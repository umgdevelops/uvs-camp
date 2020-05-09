var express = require('express')
var router = express.Router()
var passport = require('passport')
var  User = require('../models/user')
var middleware = require('../middleware')

router.get('/',function(req,res){
    // console.log('LANDING PAGE...')
    // res.render("partials/landing")
    res.json([
        {id:1, username:"hello1"},
        {id:2, username:"bonjoyr"}
    ])
})

//=============== REGISTER ROUTES
router.get('/register',function(req,res){
    res.render('register')
})
router.post('/register',function(req,res){
    var newUser = new User({username : req.body.usernameReg})
    User.register(newUser, req.body.passwordReg, function(err,userCr){
        if (err) { 
            // res.json({success:false, message:"Your account could not be saved. Error: ", err}) 
            req.flash('error',err.message)//console log the err to know better
            res.redirect('back')
            console.log(err)
        }else{ 
            console.log(userCr)
            console.log({success: true, message: "Your account has been saved"}) 
            req.login(userCr, function(err) {
                if (err) { return next(err); }
                req.flash('success','Registered successfully, Welcome '+userCr.username)
                return res.redirect('/campgrounds');
              });
        } 
    })
})

//=============  LOGIN ROUTES
router.get('/login',function(req,res){
    res.render('login')
})
router.post('/login',passport.authenticate("local",{
    successRedirect:"/campgrounds",
    failureRedirect:"/login"
}), function(req,res){
    console.log("there was a login!!!")
})

//============== LOGOUT ROUTE
router.get('/logout',function(req,res){
    req.logout()
    req.flash('info','Logged out successfully!')
    res.redirect('/campgrounds')
})

module.exports = router;