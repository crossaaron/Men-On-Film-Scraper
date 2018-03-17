const express = require('express');
const router = express.Router();
const mongojs = require("mongojs");
const cheerio = require("cheerio");
const request = require("request");

// Database configuration
const databaseUrl = "Movies";
const collections = ["movieData"];

// Hook mongojs configuration to the db variable
const db = mongojs(databaseUrl, collections);
db.on("error", function (error) {
    console.log("Database Error:", error);
});

// Retrieve data from the db
router.get("/all", function (req, res) {
    // Find all results from the scrapedData collection in the db
    db.Movie.find({}, function (error, found) {
        // Throw any errors to the console
        if (error) {
            console.log(error);
        }
        // If there are no errors, send the data to the browser as json
        else {
            res.json(found);
        }
    });
});


module.exports = router;