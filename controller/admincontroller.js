// controllers/adminController.js
const User = require('../model/usermodel');
const Notification = require("../model/notification");
require("dotenv").config();



// Login an admin
const logIn = async (req, res) => {
  try {
      const { email, password } = req.body;

      // Find the admin
      const admin = await Admin.findOne({ email });
      if (!admin) {
          return res.status(400).json({ message: 'Invalid email or password' });
      }

      // Compare passwords
      // const isMatch = await admin.comparePassword(password);
      // if (!isMatch) {
      //     return res.status(400).json({ message: 'Invalid email or password' });
      // }


      req.session.user = {
        id: admin._id,
        email: admin.email
       
      };
      // Generate a token

      // Send success response with token
      res.status(200).json({
        status: "Success",
        message: "Login successful",
        user: {
            id: admin._id,
            email: admin.email
            // Add other admin fields as needed
        }
    });
  } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Register a new admin
const registerAdmin = async (req, res) => {
  try {
      const { fullname, email, password, isAdmin } = req.body;

      // Check if admin already exists
      const existingAdmin = await Admin.findOne({ email });
      if (existingAdmin) {
          return res.status(400).json({ message: 'Admin already exists' });
      }

      // Create a new admin
      const newAdmin = new Admin({ fullname, email, password, isAdmin });
      await newAdmin.save();

      // Generate a token

      res.status(201).json({ admin: newAdmin });
  } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
  }
};



const getAllUsers = async (req, res) => {
  try {


    //console.log(transac)

            // Check if session exists
      if (!req.session.user) {
              // Session does not exist, redirect to login or show an error
              return res.redirect('/adminlogin'); 
      }

      const users = await User.find();
     

   
  
// console.log(subscribe)
    res.render('user/html/dashboard', { users}); // Rendering a view with the users data
  } catch (err) {
    res.status(500).send('Error retrieving users');
  }
};




const deleteUser = async (req, res) => {
    try {
      const userId = req.params.id; // Get user ID from request parameters
      await User.findByIdAndDelete(userId); // Delete user by ID
      res.redirect('/adminlogin'); // Redirect to users list after deletion
    } catch (err) {
      res.status(500).send('Error deleting user');
    }
  };

const search = async (req, res) => {
    const criteria = req.query;
    const query = {};

    if (criteria.email) {
        query.email = { $regex: new RegExp(criteria.email, 'i') }; // Correct regex usage
    }

    try {
        const user = await User.find(query);
        console.log(user)
        
        res.render("user/html/search",{result: user});
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while searching for jobs.' });
    }
};

// Create a new notification
const createNotification = async (req, res) => {
  try {
      const { message, user, type } = req.body;

      if (!message || !user || !type) {
          return res.status(400).json({ error: 'Message, user, and type are required.' });
      }

      // Check if the user exists
      const userExists = await Admin.findById(user);
      if (!userExists) {
          return res.status(404).json({ error: 'User not found.' });
      }

      const notification = new Notification({ message, user, type });
      await notification.save();

      // Update user's notification count
      await User.updateOne(      
        { $inc: { notificationsCount: 1 } }
      );


      //res.status(201).json(notification);
      res.redirect('/api/admin/message')
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};


module.exports = {
  getAllUsers, 
  createNotification, 
  deleteUser, 
  logIn, 
  search, 
  registerAdmin, 
 

};
