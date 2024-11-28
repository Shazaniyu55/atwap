//my express server imports
const express = require('express');
const router = express.Router();


//all my controller imports 
const 
{

    logIn, 
    signUp, 
    message
    
} = require("../controller/usercontroller");



//all my routes

//authentication routes
router.post("/register",signUp);
router.post("/login", logIn);
router.post("/message", message);


router.get('/dashboard/:userId', (req, res)=>{
    if(!req.session.user){
        res.redirect('/login')
    }else{
        res.render('dashboard/html/admin', {user: req.session.user})
    }
});



module.exports = router