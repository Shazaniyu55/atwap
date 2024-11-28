const User = require("../model/usermodel");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const jwt = require('jsonwebtoken');


//function to login
const logIn = async(req, res)=>{
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ status: "Failed", message: "invalid email or password" });
        }

        // Generate a JWT token
        const token = jwt.sign({ id: user._id }, 'Adain', { expiresIn: '1h' }); // 1 hour expiration
        // const token = user.generateAuthToken();
        //res.status(200).json({ status: "Success" });
        // Store user information in the session
    
                req.session.user = {
                    id: user._id,
                    email: user.email,
                    fullname: user.fullname, 
                    phoneNumber: user.phoneNumber,
                    country: user.country,
                    
                    accountBank: user.accountBank,
                    
                   
                   
                    
                   
                    
                    // Add other fields as needed
                };

                // Send success response
                res.status(200).json({
                    status: "Success",
                    message: "Login successful",
                    token,
                    user: {
                        id: user._id,
                        email: user.email,
                        fullname: user.fullname,
                        phoneNumber: user.phoneNumber,
                        country: user.country,
                       
                        accountBank: user.accountBank,
                        

                    }
                });
        
                // Redirect to the dashboard
                // res.redirect('/dashboard');
    } catch (error) {
        console.error("Error during login:", error);

        // Handle errors and ensure only one response
        if (!res.headersSent) {
            res.status(500).json({ status: "Failed", message: error.message });
        }   
    }
    
    
};


//function to request a password rest
const requestPasswordReset = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ status: "Failed", message: "Email does not exist in our records." });
        }

        // Generate a reset token
        const resetToken = crypto.randomBytes(32).toString('hex');

        // Save the reset token and its expiry date in the user record
        user.resetToken = resetToken;
        user.resetTokenExpiry = Date.now() + 3600000; // 1 hour expiry
        await user.save();

        // Set up email transporter
        const transporter = nodemailer.createTransport({
            service: process.env.SERVICE,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASS,
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        // Send password reset email
        //const resetUrl = `http://localhost:3500/reset-password`;
        const resetUrl = `http://localhost:3500/reset-password?token=${resetToken}`;
        await transporter.sendMail({
            from: 'affliate@gmail.com',
            to: `${email}`,
            subject: 'Password Reset Request',
            html: `<p>You requested a password reset. Click the link below to reset your password:</p>
                   <a href="${resetUrl}">Reset Password</a>
                   <p>If you did not request this, please ignore this email.</p>`
        });

        res.status(200).json({ status: "Success", message: "Password reset email sent successfully Check Your Mail." });


    } catch (error) {
        console.error("Error sending password reset email:", error);
        res.status(500).json({ status: "Failed", message: error.message });
    }
};


//function to reset password
const resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;

    try {
        // Find the user by reset token
        const user = await User.findOne({
            resetToken: token,
            resetTokenExpiry: { $gt: Date.now() } // Check if token is expired
        });

        if (!user) {
            return res.status(400).json({ status: "Failed", message: "Invalid or expired token." });
        }

        // Hash the new password
        //const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update user password and clear reset token
        user.password = newPassword;
        user.resetToken = undefined;
        user.resetTokenExpiry = undefined;
        await user.save();

        res.status(200).json({
            status: "Success",
            message: "Password update successfully",
          });
        // Redirect to login page after successful password update
        //res.redirect('/login'); // Adjust the path as needed for your login route

    } catch (error) {
        console.error("Error resetting password:", error);
        res.status(500).json({ status: "Failed", message: error.message });
    }
};

const signUp = async (req, res) => {
    try {
      const { fullname, phoneNumber, email,  accountBank,country, businessType,  password } = req.body;
  //console.log(fullname, phoneNumber)
      if (!fullname || !phoneNumber || !country   || !accountBank || !email || !password || !businessType) {
        return res.status(400).json({ status: "Failed", message: "Please fill out all fields." });
        
      }
  
      //let imageURL = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png';
  
    

      async function createuser(){

         // Create a new user with the provided data and the image URL if available
      const user = new User({
        fullname,
        phoneNumber,
        country,
        accountBank,
        email,
        businessType,
        password,
        
      });

    


    


        try {
            await user.save();
            //await payment.save();
           
            // Generate a JWT token
            const token = jwt.sign({ id: user._id}, 'Adain', { expiresIn: '1h' });

            req.session.user = {
                id: user._id,
                email: user.email,
                fullname: user.fullname, 
                phoneNumber: user.phoneNumber,
                country: user.country,
                businessType: user.businessType,
                accountBank: user.accountBank,
               
               
               
                
                // Add other fields as needed
            };
            res.status(200).json({
                status: "Success",
                message: "Login successful",
                token,
                user: {
                    id: user._id,
                    email: user.email,
                    fullname: user.fullname,
                    phoneNumber: user.phoneNumber,
                    country: user.country,
                    businessType: user.businessType,
                    accountBank: user.accountBank,
                  
                    
                }
            });
            
        } catch (error) {
            console.error('Error saving product:', error);
                res.status(500).send('Error saving product');
        }
      }
  
     
  
      createuser()
  
     
    } catch (error) {
      console.error("Error during signup:", error);
  
      // Handle errors and ensure only one response
      if (!res.headersSent) {
        res.status(500).json({ status: "Failed", message: error.message });
      }
    }
};


const updateUser = async (req, res) => {
    try {
        // Ensure the user is authenticated
        if (!req.session.user || !req.session.user.id) {
            return res.status(401).json({ status: "Failed", message: "Unauthorized" });
        }

        // Get the user ID from the session
        const userId = req.session.user.id;

        // Build the update object
        const updateData = {};

        if (req.body.fullname) updateData.fullname = req.body.fullname;
        if (req.body.phoneNumber) updateData.phoneNumber = req.body.phoneNumber;
        if (req.body.country) updateData.country = req.body.country;

        // Check if a file was uploaded
        if (req.file) {
            // Upload the image to Cloudinary
            const result = await cloudinary.uploader.upload_stream({ resource_type: 'image' }, async (error, result) => {
                if (error) {
                    return res.status(500).json({ status: "Failed", message: error.message });
                }

                // Save the Cloudinary URL to updateData
                updateData.profilePic = result.secure_url;

                // Update the user in the database
                const user = await User.findByIdAndUpdate(userId, updateData, { new: true });

                if (!user) {
                    return res.status(404).json({ status: "Failed", message: "User not found" });
                }

                // Update user information in the session if needed
                req.session.user = {
                    ...req.session.user,
                    ...updateData,
                };

                // Redirect or respond with success
                res.redirect('/niyu');
            });

            req.file.stream.pipe(result);
        } else {
            // If no file was uploaded, update the user without changing the profile picture
            const user = await User.findByIdAndUpdate(userId, updateData, { new: true });

            if (!user) {
                return res.status(404).json({ status: "Failed", message: "User not found" });
            }

            // Update user information in the session if needed
            req.session.user = {
                ...req.session.user,
                ...updateData,
            };

            // Redirect or respond with success
            res.redirect('/niyu');
        }
    } catch (error) {
        res.status(500).json({ status: "Failed", message: error.message });
    }
};




const getUserById = async(userId)=>{
    const user = await User.findById(userId);

    if (!user) {
        throw new Error('User not found');
    }else{
        return user;
    }
}


//function to send message to us......
const message = (req, res)=>{
    const {fullname, email, message, subject} = req.body;
     //console.log(fullname, email, message, subject)
    const transporter = nodemailer.createTransport({
        service:  process.env.SERVICE,
        auth:{
            user: process.env.EMAIL,
            pass :process.env.EMAIL_PASS,
        },
        tls:{
            rejectUnauthorized: false
        }
    })

     // Setup email data
     let mailOptions = {
        from: 'shazaniyu@gmail.com', // Sender address
        to: 'shazaniyu@gmail.com', // List of recipients
        subject: 'ATWAP', // Subject line
        text: `Name: ${fullname}\n Subject:${subject}\nEmail: ${email}\nMessage: ${message}`, // Plain text body
        // You can add HTML to the email if needed
        // html: '<p>Name: ' + name + '</p><p>Email: ' + email + '</p><p>Message: ' + message + '</p>'
    };

    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
          //res.status(200).json({status:"Success", message: "Email Deliver"});
          res.render('email')
          //alert("email delivered")
    });
};

//function to reset password
const renderResetPasswordPage = async (req, res) => {
    const { token } = req.query;

    try {
        // Validate the reset token
        const user = await User.findOne({
            resetToken: token,
            resetTokenExpiry: { $gt: Date.now() } // Check if token is expired
        });

        if (!user) {
            return res.status(400).render('error', { message: "Invalid or expired token." });
        }

        // Render the password reset page with the token
        res.render('resetPassword', { token });
    } catch (error) {
        console.error("Error rendering password reset page:", error);
        res.status(500).render('error', { message: error.message });
    }
};










module.exports =
{
    getUserById,
    signUp, 
    logIn, 
    message, 
    updateUser, 
    requestPasswordReset, 
    resetPassword, 
    renderResetPasswordPage,
   
    

};