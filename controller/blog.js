const Blog = require('../model/blog');
const User = require("../model/usermodel");
// Create a new notification
const createBlog = async (req, res) => {
    try {
        const { message, user, type } = req.body;

        if (!message || !user || !type) {
            return res.status(400).json({ error: 'Message, user, and type are required.' });
        }

        // Check if the user exists
        const userExists = await User.findById(user);
        if (!userExists) {
            return res.status(404).json({ error: 'User not found.' });
        }

        const notification = new Blog({ message, user, type });
        await notification.save();

        // Update user's notification count
        await User.findByIdAndUpdate(user, { $inc: { notificationsCount: 1 } });

        res.status(201).json(notification);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all notifications for a user
const getUserBlog = async (req, res) => {
    try {
        const userId = req.params.userId;
    
        // Fetch the user details
        const user = await User.findById(userId);
        if (!user) {
          return res.status(404).render('error', { message: 'User not found' });
        }
    
        // Fetch notifications for the user
        const notifications = await Blog.find().sort({ createdAt: -1 });

        res.render('admin/html/notification', { notifications, user });
    } catch (error) {
        res.status(500).render('error', { message: error.message });
    }
};




module.exports = 
{
    createBlog,
    getUserBlog,
}
