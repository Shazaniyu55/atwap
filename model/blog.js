const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
       
        required: true
    },
    image:{
        type:String,
        default: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    
   
},
{
    timestamps: true
});

module.exports = mongoose.model('Blog', blogSchema);
