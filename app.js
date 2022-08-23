//jshint esversion:6
require('dotenv').config();
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const bcrypt = require('bcrypt');
const saltRounds = 10;


const app = express();

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended:true}));


mongoose.connect("mongodb://127.0.0.1:27017/userDB", {useNewUrlParser:true});

const userSchema = new mongoose.Schema({
  email : String,
  password: String
});




const User = new mongoose.model('User', userSchema);







app.get('/', (req,res) => {
  res.render("home");
});

app.get('/login', (req,res) => {
  res.render("login");
});

app.get('/register', (req,res) => {
  res.render("register");
});



app.post('/register', (req,res) => {

  bcrypt.hash(req.body.password, saltRounds).then(function(hash) {

    const newUser = new User({
      email : req.body.username,
      password : hash
    });

    newUser.save((err) => {

      if(err){
        console.log(err);
      } else{
        res.render('secrets');
      }

    });

});

});

app.post('/login', (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({email : username}, (err, foundUser) => {

    if(err){
      console.log(err);
    }
    else{
      if(foundUser){
        bcrypt.compare(password, foundUser.password, function(error, result) {
          if(result === true){
            res.render('secrets');
          } else if(err === true){
            console.log(error);
          } else if(password !== foundUser.password){
            console.log("Password entered is incorrect. Please enter correct password..");
          }
        });

      }
    }

  });
});



app.listen(3000, () => console.log('App is listening on port 3000'));
