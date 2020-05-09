var express = require('express')
var router = express.Router({mergeParams:true})
var Campground = require('../models/campground')
var Comment = require('../models/comment')
var middleware = require('../middleware')

// NEW COMMENT FORM ROUTE
router.get('/new', middleware.isLoggedin, function(req,res){
    Campground.findById(req.params.id,function(err,found){
        if (err) {
            req.flash('error','Hmmm, there was an error! Try again later')
            res.redirect('back')
        }else{
            console.log(found)
            res.render('comment/new',{campPassed:found})
        }
    })
})

//CREATING THE NEW COMMENT IN DB
router.post('/', middleware.isLoggedin, function(req,res){
    // res.send('you are in comment post route!!')
    Campground.findById(req.params.id,function(err,found){
        if (err) {
            req.flash('error','Unable to create new comment! Try again later.')
            res.redirect('back')
        }else{
            Comment.create(req.body.comment,function(err,created){
                if (err) {
                    console.log(err)
                    req.flash('error','Unable to create new comment! Try again later.')
                    res.redirect('back')
                }else{
                    created.author.id = req.user._id
                    created.author.username = req.user.username
                    created.save()
                    found.comments.push(created)
                    found.save(function(err,saved){
                        if (err) {
                            res.send('THERE WAS AN ERROR IN SAVING THE COMMENT!!!')
                        }else{
                            console.log('comment CREATED ====== '+saved)
                            req.flash('success','Comment created successfully')
                            res.redirect('/campgrounds/'+req.params.id)
                        }
                    })
                }
            })
        }
    })
})

// EDIT FORM ROUTE
router.get('/:comment_id/edit', middleware.checkCommentOwnership, function(req,res){
    // we do not need to find campground again as done below bcoz  
    // we have already found it in req.params.id!!!
    Campground.findById(req.params.id, function(err, campFound){
        if(err){
            req.flash('error','Unable to edit comment! Try again later.')
            res.redirect('back')
            console.log(err+'error unable to find camp to edit its comment')
        }else{
            Comment.findById(req.params.comment_id,function(err,commentFound){
                if(err){
                    req.flash('error','Hmmm, there was an error! Try again later')
                    res.redirect('back')
                    console.log(' error in commenting '+err)
                }else{
                    res.render('comment/edit',{campPassed:campFound, commentPassed:commentFound})
                }
            })
        }
    })
})

//UPDATE ROUTE
router.put('/:comment_id', middleware.checkCommentOwnership, function(req,res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err,updatedComm){
        if(err){
            console.log('error UPDATE HERE'+err)
            req.flash('error','Unable to update comment! Try again later.')
        }else{
            console.log(updatedComm)
            req.flash('success','Comment updated successfully!')
            res.redirect('/campgrounds/'+req.params.id)
        }
    })
})

//DELETE ROUTE
//  --------------  PENDING -------- these comments do not get deleted from 
//  campgroundSchema where it stores the id of associated comments they have to be 
//  deleted explicitly, like it was done during deletion of campground - it also deletes
//  associated commentss
router.delete('/:comment_id', middleware.checkCommentOwnership, function(req,res){
    Comment.findByIdAndDelete(req.params.comment_id, function(err,deleteComm){
        if (err) {
            console.log(err)
            req.flash('error','Unable to delete comment! Try again later.')
            res.redirect('/campgrounds/'+req.params.id) 
        } else {
            console.log(deleteComm)
            req.flash('info','Comment deleted successfully!')
            res.redirect('/campgrounds/'+req.params.id)
        }
    })
})

module.exports = router