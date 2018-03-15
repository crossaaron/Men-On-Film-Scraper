const express = require('express');
const router = express.Router();
const db = require("../models");

router.get('/', (req, res) => {
    res.render('home');
    // db.Movie
    //     .find({})
    //     .then(articles => res.render('index', { articles }))
    //     .catch(err => res.json(err));
});


module.exports = router;