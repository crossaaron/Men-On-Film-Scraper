const mongoose = require('mongoose');

// Save a reference to the Schema constructor
let Schema = mongoose.Schema;

// Using the Schema constructor, create a new UserSchema object
const MovieSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    link: String,
    
    // `note` is an object that stores a Note id
    // The ref property links the ObjectId to the Note model
    // This allows us to populate the Article with an associated Note
    note: [
        {
            type: Schema.Types.ObjectId,
            ref: "Note"
        }
    ]
});

const Movie = module.exports = mongoose.model('Movie', MovieSchema);