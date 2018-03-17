const express = require('express');
const router = express.Router();
const mongojs = require("mongojs");


// Database configuration
const databaseUrl = "Movies";
const collections = ["movieData"];

// Hook mongojs configuration to the db variable
const db = mongojs(databaseUrl, collections);
db.on("error", function (error) {
    console.log("Database Error:", error);
});

//get route and template with index.handlebars w
router.get('/', (req, res) => {
    db.movieData
        res.render('home');
        // .then(movies => res.render('index', { movies }))
        // .catch(err => res.json(err));
   
});



module.exports = router;