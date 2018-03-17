const express = require('express');
const router = express.Router();
const db = require("../models");

//get route to update 'saved' boolean to true
router.get('/save/:id', (req, res) => {
    db.Movies
        .update({ _id: req.params.id }, { saved: true })
        .then(result => res.redirect('/'))
        .catch(err => res.json(err));
});

//get route to render saved.handlebars and populate with saved Movies
router.get('/viewSaved', (req, res) => {
    db.Movies
        .find({})
        .then(result => res.render('savedArticles', { articles: result }))
        .catch(err => res.json(err));
});

//delete route to remove an movie from saved
router.delete('/deleteMovie/:id', function (req, res) {
    db.Movies
        .remove({ _id: req.params.id })
        .then(result => res.json(result))
        .catch(err => res.json(err));
});




module.exports = router;