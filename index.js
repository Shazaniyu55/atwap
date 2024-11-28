const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
const app = express();
const authRoute = require("./routes/userroutes");
const mongoose = require("mongoose");
const port = 3100;
require('dotenv').config()
//host my express static files

//connects to the mongoDB databse
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
app.get('/blog', (req, res)=>{
    res.render('blog')
})

app.get('/dashboard', (req, res)=>{
    res.render('dashboard/html/admin')
})

app.get('/contact', (req, res)=>{
    res.render('contact')
})

app.listen(port, ()=>{
    console.log(`server running at port http://localhost:${port}`);
})



