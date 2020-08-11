var   
	  bodyParser            = require("body-parser"),
      Campground            = require("./models/campground"),
      Comment               = require("./models/comment"),
	  express               = require("express"),
      app                   = express(),
	  LocalStrategy         = require('passport-local'),  
	  mongoose              = require('mongoose'),   
	  passport              = require('passport'),
	  passportLocalMongoose = require('passport-local-mongoose'),
	  methodOverride         = require('method-override'),
      seedDB                = require("./seeds"),
	  User                  = require("./models/user");

//requireing routes
var   
      commentRoutes         = require("./routes/comments"), 
	  campgroundRoutes      = require("./routes/campgrounds"), 
	  indexRoutes           =   require("./routes/index");
// seedDB();
mongoose.connect('mongodb://localhost:27017/db_name', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to DB!'))
.catch(error => console.log(error.message));

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname +"/public"));
app.use(methodOverride("_method"));
app.use(require("express-session")({
	secret: "shakti",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req,res,next)=>{
	res.locals.currentUser = req.user;
	next();
})
app.use("/campgrounds/:id/comments",commentRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use(indexRoutes);

app.listen(3000, ()=>{
   console.log("The YelpCamp Server Has Started!");
});