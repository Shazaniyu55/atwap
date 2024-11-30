const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
const app = express();
const authRoute = require("./routes/userroutes");
const adminRoute = require("./routes/adminroutes");
const mongoose = require("mongoose");
const Blog  = require("./model/blog")
const port = 3100;
require('dotenv').config();

mongoose.connect(process.env.MONGODB_CONNECTION).then(()=>{console.log("Database Connected")}).catch((err)=>{console.log(err)});
app.use (express.static(path.join(__dirname, "assets")));
app.use(cors());

app.use(session({
    secret: process.env.SESSION_SECRETE,
    resave: false,
    saveUninitialized: true,
    cookie: {secure: false, }
    
}));

//parses data  to json
//app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({extended: true}));

//set my view engine as ejs....
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); 
app.use("/api/auth", authRoute);
app.use("/api/admin", adminRoute);

app.get('/', (req, res)=>{
    res.render('index')
})

app.get('/login', (req, res)=>{
    res.render('login')
})

app.get('/reg2', (req, res)=>{
    res.render('register')
})


app.get('/about', (req, res)=>{
    res.render('about')
})
app.get('/blog', async(req, res)=>{
    try {
        const blog = await Blog.find()
        console.log(blog)
        res.render('blog',{blog})
    } catch (error) {
        
    }
    
})
app.get('/adminlogin', (req, res)=>{
    res.render("adminlogin")
});

app.get('/dashboard', (req, res)=>{
    res.render('dashboard/html/admin')
})

app.get('/contact', (req, res)=>{
    res.render('contact')
})

app.get('/logout', (req, res)=>{
    req.session.destroy(err =>{
        if (err) {
            return res.status(500).json({status: "failed", message: err.message});
        }else{
            res.redirect('/login')
        }
    })
})

app.use((req, res, next)=>{
    res.render('404')
})

app.listen(port, ()=>{
    console.log(`server running at port http://localhost:${port}`);
})



