const mongoose = require('mongoose');
let Schema = mongoose.Schema;

const movieSchema = new Schema({
    title: {
        type: String,
        unique: true
    },
    link: String,
    notes: [
        {
            type: Schema.Types.ObjectId,
            ref: "Note"
        }
    ]
});

const Movie = module.exports = mongoose.model('Movie', movieSchema);