const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const exphbs = require('express-handlebars');

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

var PORT = 3000;

// Initialize Express
var app = express();


// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: false }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

//Set Handlebars as templating engine
app.engine("handlebars", exphbs({defaultLayout: "main"}));
app.set("view engine", "handlebars");

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect("mongodb://localhost/movieScraper")
    .catch(err => console.log('There was an error with your connection:', err));

//'/' route
app.get('/', (req,res) => {
    res.render('home');
});

//GET route scraping fandango site
app.get('/scrape', (req, res) => {
    // Make a request call to grab the HTML body from fandango
    axios.get("https://www.fandango.com/moviesintheaters").then(function (response) {
        // Load the HTML into cheerio and save as a shorthand variable
        let $ = cheerio.load(response.data);
       
        // Select each element in the HTML body from which you want information.
        $("li.visual-item").each(function (i, element) {
            // An empty array to save the data that we'll scrape
            let result = {};
            
            result.link = $(element).children().attr("href");
            result.title = $(element).text().trim();
            // Save these results in an object that we'll push into the results array

            // Create a new Article using the `result` object built from scraping
            db.Movie.create(result)
                .then(function (dbMovie) {
                    // View the added result in the console
                    console.log(dbMovie);
                })
                .catch(function (err) {
                    // If an error occurred, send it to the client
                    return res.json(err);
                });
        });
        res.send("Scrape Complete");
    });
});

// Route for getting all Articles from the db
app.get("/movies", function (req, res) {
    // Grab every document in the movieData collection
    db.Movie.find({}).limit(10)
        .then(function (dbMovie) {
            // send them back to the client
            res.json(dbMovie);
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});

//route for getting movie by ID
app.get("/movies/:id", function (req, res) {
    //using id param in url to find matching in database
    db.Movie.findOne({ _id: req.params.id })
        // ..and populate all of the notes associated with it
        .populate("note")
        .then(function (dbArticle) {
            // If successful, find Movie with the given id, send it back to the client
            res.json(dbArticle);
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});

// Route for saving/updating an Article's associated Note
app.post("/movies/:id", function (req, res) {
    // Create a new note and pass the req.body to the entry
    db.Note.create(req.body)
        .then(function (dbNote) {
            // If a Note was created successfully, find one Movie with an `_id` equal to `req.params.id`. *Update* 
            // { new: true } returns the updated Movie -- it returns the original by default
            // mongoose query returns a promise, chain another `.then` which receives the result of the query
            return db.Movie.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
        })
        .then(function (dbMovie) {
            // send it back to the client
            res.json(dbMovie);
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});

// Start Server
app.listen(3000, function() {
    console.log("App running on port " + PORT)
});