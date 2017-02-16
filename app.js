var bodyParser = require("body-parser"),
methodOverride = require("method-override"),
mongoose       = require("mongoose"),
expressSanitizer = require("express-sanitizer");


var express     = require("express"),
    flash       = require("connect-flash"),
    passport    = require("passport"),
    LocalStrategy = require("passport-local"),
    User        = require("./models/user");

     var app = express();
     var indexRoutes = require("./routes/index");
     var foodtube = require("./routes/foodtube");

mongoose.connect("mongodb://rajeswaran:tamil2000@ds117889.mlab.com:17889/restfulblogappp");

app.set("view engine","ejs");

app.use(express.static("public"));
app.use(expressSanitizer());
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(flash());

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});


app.use("/", indexRoutes);
app.use("/foodtube", foodtube);


app.listen(process.env.PORT || 3000, process.env.IP, function(){
	console.log("The Server Has Started!");
});