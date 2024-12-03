//my express server imports
const express = require('express');
const router = express.Router();
const multer = require("multer")
//all my controller imports 
const 
{
  
   deleteUser,
   logIn,
   search,
   registerAdmin,
   getAllUsers,
   uploadToBlog

} 
= require("../controller/admincontroller");


const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage: storage });


router.post('/login', logIn);
router.post('/registeradmin', registerAdmin);
router.get('/getall', getAllUsers);
router.post('/remove/:id/delete', deleteUser); 
router.get('/search', search);
router.post('/upload-blog', upload.single('image'), uploadToBlog);
router.get('/payment', (req, res)=>{
   if (!req.session.user) {
      return res.redirect('/login'); // Redirect to login if not authenticated
    }
   res.render('admin/html/payments', { users: req.session.user })
});


router.get('/blog', (req, res)=>{
   if (!req.session.user) {
      return res.redirect('/login'); // Redirect to login if not authenticated
    }
   res.render('admin/html/blog', { user: req.session.user })
})

module.exports = router;