//my express server imports
const express = require('express');
const router = express.Router();
const User = require("../model/usermodel");

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





router.post('/firebase-login', async (req, res) => {
    const { uid, email } = req.body;

    if (!uid || !email) {
        return res.status(400).json({ message: 'Invalid user data' });
    }

    try {
        let user = await User.findOne({ email });

        if (!user) {
            // Create new user if not exists
            user = new User({
                email,
                firebaseUID: uid,
            });
            await user.save();
            console.log(user)
        }

        res.status(200).json({ id: user._id, message: 'Login successful' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});




module.exports = router