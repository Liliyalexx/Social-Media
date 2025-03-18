// const mongoose = require('mongoose');

// const postSchema = new mongoose.Schema({
//     user: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref : 'User'
//     },
//     title: String,
//     description: String,
//     image: String
// });


// module.exports = mongoose.model('Post', postSchema);

// const mongoose = require("mongoose");

const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
    title: String,
    description: String,
    image: String,
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    comments: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        text: String,
        createdAt: { type: Date, default: Date.now }
    }]
});

module.exports = mongoose.model('Post', postSchema);

