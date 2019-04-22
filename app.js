var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    flash       = require("connect-flash"),
    Campground  = require("./models/campground"),
    Comment     = require("./models/comment"),
    //seedDB      = require("./seed"),
    passport    = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOv    = require("method-override"),
    User        = require("./models/user");

var commentRoutes     = require("./routes/comments"),
    campgroundRoutes  = require("./routes/campgrounds"),
    indexRoutes        = require("./routes/index");

mongoose.connect('mongodb+srv://yelpcampRoot:prueba12345@cluster0-iuajh.mongodb.net/test?retryWrites=true', {useFindAndModify: false, useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOv("_method"));
app.use(flash());

//seedDB();

// Passport config
app.use(require("express-session")({
  secret: "OepOE1lckgfP0vQ1Ddtv54Gn9O8agBpJBaShz2xv",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next)=>{
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(process.env.PORT, process.env.IP, ()=>{
  console.log("The YelpCamp Server Has Started!");
});