var express = require('express')
var router = express.Router()
var Campground = require('../models/campground')
var Comment = require('../models/comment')
var middleware = require('../middleware')

router.get('/', function(req,res){
    Campground.find({},function(err,found){
        if (err) {
            res.send('CAMPGROUNDS NOT FOUND ERRORR !!!')
        }else{
            res.render('campground/campgrounds',{campgroundsPassed:found})
        }
    })
})
//ADD NEW CAMPGROUND
router.get('/new', middleware.isLoggedin ,function(req,res){
    res.render('campground/new')
})
//CREATING THE NEW CAMPGROUND IN DB
router.post('/' , function(req,res){
    Campground.create(req.body.camp,function(err,created){
        if (err) {
            res.send('ERROR IN CREATING NEW CAMP !!!')
        }else{
            created.author.id = req.user._id
            created.author.username = req.user.username
            created.save()
            console.log('CAMPground CREATED ====== '+created)
            res.redirect('/campgrounds')
        }
    })
})

//SHOW ROUTE    
router.get('/:id', function(req,res){
    Campground.findById(req.params.id).populate('comments').exec(function(err,found){
        if (err) {
            res.send('ERROR IN SHOWING THE CAMP')
        }else{
            console.log()
            res.render('campground/show',{campFound:found})      
        }
    })
})

//EDIT FORM ROUTE
router.get('/:id/edit', middleware.checkCampgroundOwnership, function(req,res){
    Campground.findById(req.params.id, function(err,campFound){
        if(err){
            console.log('CAMP NOT FOUND TO FETCH TO EDIT:::'+err)
            req.flash('error','Currently, campground unable to edit. Try again later!')
            res.redirect('back')
        }else{
            res.render('campground/edit',{campgroundsPassed:campFound})
        }
    })
})
//UPDATE THE EDITED ROUTE
router.put('/:id', middleware.checkCampgroundOwnership, function(req,res){
    Campground.findByIdAndUpdate(req.params.id, req.body.camp,function(err,updated){
        if (err) {
            console.log(err)
            req.flash('error','Currently, campground unable to update. Try again later!')
            res.redirect('back')
        }else{
            req.flash('success','Campground updated successfully!')
            res.redirect('/campgrounds/'+req.params.id)
            console.log(updated)
        }
    })
})

//DELETE campground ROUTE
router.delete('/:id', middleware.checkCampgroundOwnership, function(req,res){
    //find the camp and remove all associated comments first!
    //remove the campground
    Campground.findById(req.params.id,function(err,campFound){
        if(err){
            console.log("ERROR IN COMMENT DELETE"+errora)
            req.flash('error','Currently campground unable to delete. Try again later!')
            res.redirect('back')
        }else{
            campFound.comments.forEach(comm => {
                Comment.findByIdAndRemove(comm,function(errora,deletedComm){
                    if (errora) {
                        console.log("ERROR IN COMMENT DELETE"+errora)
                        req.flash('error','Unable to delete. Try again later!')
                        res.redirect('back')
                    }else{
                        console.log(deletedComm)
                    }
                })
            });
            campFound.remove(function(err,ifdeleted){
                if (err) {
                    console.log('errpr')
                    req.flash('error','Currently campground unable to delete. Try again later!')
                    res.redirect('back')
                }else{
                    console.log(ifdeleted)
                    req.flash('info','Campground deleted successfully!')
                    res.redirect('/campgrounds')
                }
            })
        }
    })
})

module.exports = router;