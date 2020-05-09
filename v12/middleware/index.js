//we named index to the file because when we include/require in server.js, 
// we need not to mention the filename, just the folder name as middleware

var Campground = require('../models/campground')
var Comment = require('../models/comment')

var middlewareObj = {}

// to check campground authenticity and permissions
middlewareObj.checkCampgroundOwnership = function(req,res,next){
    if( req.isAuthenticated() ){
        //user not logged in
        //this middleware would be able to avoid indirect postman request also.
        Campground.findById(req.params.id, function(err,campFound){
            if(err){
                console.log('CAMP NOT FOUND TO FETCH TO EDIT:::'+err)
                res.redirect('/campgrounds/'+req.params.id)
            }else{
                //check wether the user is owner of the camp or not
                if( campFound.author.id.equals(req.user._id) ){
                    next()
                }else{
                    console.log('You are not allowed to that!')
                    req.flash('error','You are not allowed to that!')
                    res.redirect('/campgrounds/'+req.params.id)
                }
            }
        })
    }else{
        req.flash('error','You are not allowed to that!')
        res.redirect('back')
    }
}

// to check comment authenticity and permissions
middlewareObj.checkCommentOwnership = function(req,res,next){
    if( req.isAuthenticated() ){
        //user not logged in
        //this middleware would be able to avoid indirect postman 
        // request also, if and only if included in put rout
        Comment.findById(req.params.comment_id, function(err,commentFound){
            if(err){
                console.log('comment unfound ::::: '+err)
                req.flash('error','Unable to edit the comment!')
                res.redirect('back')
            }else{
                //check wether the user is owner of the camp or not
                if( commentFound.author.id.equals(req.user._id) ){
                    next()
                }else{
                    req.flash('error','You are not allowed to that!')
                    res.redirect('back')
                }
            }
        })
    }else{
        req.flash('error','You are not allowed to that!')
        res.redirect('back')
    }
}

//to check logged in status
middlewareObj.isLoggedin = function(req,res,next){
    if (req.isAuthenticated()) {
        console.log('logged in user: '+req.user.username+req.isAuthenticated())
        return next();
    }
    req.flash('error','You must be logged in!')
    res.redirect('/login'); 
}

middlewareObj.hello = function(req,res,next){
    req.flash('error','HELLO WORLD')
    next()
}

module.exports = middlewareObj