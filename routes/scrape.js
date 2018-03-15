const express = require('express');
const router = express.Router();
var mongojs = require("mongojs");
const cheerio = require("cheerio");
const request = require("request");

// Database configuration
var databaseUrl = "Movies";
var collections = ["movieData"];

// Hook mongojs configuration to the db variable
var db = mongojs(databaseUrl, collections);
db.on("error", function (error) {
    console.log("Database Error:", error);
});

// Retrieve data from the db
router.get("/all", function (req, res) {
    // Find all results from the scrapedData collection in the db
    db.movieData.find({}, function (error, found) {
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

router.get('/newMovies', (req, res) => {
    // Make a request call to grab the HTML body from fandango
    request("https://www.fandango.com/moviesintheaters", function (error, response, html) {
        // Load the HTML into cheerio and save it to a variable
        // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
        let $ = cheerio.load(html);
        // An empty array to save the data that we'll scrape
        let results = [];
        // Select each element in the HTML body from which you want information.
        $("li.visual-item").each(function (i, element) {
            let link = $(element).children().attr("href");
            let title = $(element).text().trim();
            // Save these results in an object that we'll push into the results array we defined earlier
            // If this found element had both a title and a link
            if (title && link) {
                // Insert the data in the scrapedData db
                db.movieData.insert({
                    title: title,
                    link: link
                },
                    function (err, inserted) {
                        if (err) {
                            // Log the error if one is encountered during the query
                            console.log(err);
                        }
                        else {
                            // Otherwise, log the inserted data
                            console.log("Data Inserted");
                        }
                    });
            }
            results.push({
                title: title,
                link: link,
            });

        });
        // // Log the results once you've looped through each of the elements found with cheerio
        // console.log(results);
           
    });
    
});

    


module.exports = router;