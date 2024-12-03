//my express server imports
const express = require('express');
const router = express.Router();
const User = require("../model/usermodel");
const multer = require("multer");
const Tax = require("../model/tax");
//all my controller imports 
const 
{

    logIn, 
    signUp, 
    message,
    firebaseLogin,
    getUserById,
    payTax,
    printReceipt
    
} = require("../controller/usercontroller");


const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage: storage });

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


router.get('/users/profile/:userId', async(req, res)=>{
    try {
        const userId = req.params.userId;
        const userniyu = getUserById(userId);
        res.render("dashboard/html/profile", {userniyu, user: req.session.user })

    } catch (error) {
        res.status(500).send( error.message );
    }
})

router.post('/firebase-login', firebaseLogin)

router.post('/tax-create',upload.single('paymentProof'), payTax)

router.get('/subscriptionpop', async(req, res)=>{
    
    if (!req.session.user) {
        return res.redirect('/login'); // Redirect to login if not authenticated
      }

    res.render("suceesspop", { user: req.session.user })
});


router.get('/receipt/:taxId',printReceipt);



module.exports = router