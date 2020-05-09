var express     = require('express'),
    app         = express(),
    mongoose    = require('mongoose'),
    bodyParser  = require('body-parser'),
    Campground  = require('./models/campground'),
    Comment     = require('./models/comment'),
    User        = require('./models/user'),
    passport    = require('passport'),
    LocalStrategy = require('passport-local'),
    passportLocalMongoose = require('passport-local-mongoose'),
    methodOverride = require('method-override')
    flash = require('connect-flash')

var commentRoutes = require('./routes/commentRoutes')
var campgroundRoutes = require('./routes/campgroundRoutes')
var mainRoutes = require('./routes/mainRoutes')

//mongoose connection
mongoose.set('useNewUrlParser', true)
mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true)
mongoose.set('useUnifiedTopology', true)
mongoose.connect("mongodb://localhost/yelp_camp")

app.set('view engine','ejs')
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static("public"))
app.use(methodOverride("_method"));
app.use(flash())
// var seedDb = require('./seeds.js')
// seedDb();

app.use(require('express-session')({
    secret : 'This is my first encode method', //used as key to encode decode
    resave : false,
    saveUninitialized : false
}))
app.use(passport.initialize())
app.use(passport.session())

passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

//this passes loggedinUser to all the tempelates via every respective routes
app.use(function(req,res,next){
    res.locals.loggedinUser = req.user
    res.locals.error = req.flash("error")
    res.locals.info = req.flash("info")
    res.locals.success = req.flash('success')
    next()
})

app.use('/campgrounds/:id/comment',commentRoutes)
app.use('/campgrounds',campgroundRoutes)
app.use(mainRoutes)

app.listen(4000,function(){
    console.log('I AM SERVING !!!')
})