const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    message: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Assuming you have a User model
        required: true
    },
    
   
},
{
    timestamps: true
});

module.exports = mongoose.model('Blog', blogSchema);
