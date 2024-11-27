//my express server imports
const express = require('express');
const router = express.Router();


//all my controller imports 
const 
{

    logIn, 
    signUp, 

    
} = require("../controller/usercontroller");



//all my routes

//authentication routes
router.post("/register",signUp);
router.post("/login", logIn);




module.exports = router