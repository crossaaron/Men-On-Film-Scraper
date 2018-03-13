var express = require("express");
var exphbs = require("express-handlebars");
var mongojs = require("mongojs");
var bodyParser = require("body-parser");
var logger = require("morgan");

var app = express();

// morgan is used to log our HTTP Requests. By setting morgan to 'dev' 
// the :status token will be colored red for server error codes, 
// yellow for client error codes, cyan for redirection codes, 
// and uncolored for all other codes.
app.use(logger("dev"));
// Setup the app with body-parser and a static folder
app.use(
    bodyParser.urlencoded({
        extended: false
    })
);
app.use(express.static("public"));

//Set Handlebars as templating engine
app.engine("handlebars", exphbs({defaultLayout: "main"}));
app.set("view engine", "handlebars");

//Database configuration (mongoDB)
var databaseUrl = "movieScraper";
var collections = ["notes"];

//hooking mongojs config to db variables
var db = mongojs(databaseUrl, collections);

//log any mongo js errors to console
db.on("error", function(error) {
    console.log("Database Error:", error);
});

//Routes

//INDEX ROUTE
app.get("/", function(req,res) {
    res.render("home");
});





// LISTEN ON PORT 3000
app.listen(3000, function() {
    console.log("App running on port 3000!")
});