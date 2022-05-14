//jshint esversion:6
require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');

mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

// to encryp the user data in the db
const secret = process.env.SECRET
// this method encryps everything inside the db,to choose what to encrypy, pass in an array containing your choice(s) to be encrypted into excryptedField as seen below
userSchema.plugin(encrypt, {secret:secret, encryptedFields: ["password"]});

const User = mongoose.model("User", userSchema)

app.route("/")
  .get(function(req, res){
    res.render("home")
  });


app.route("/login")
  .get(function(req, res){
    res.render("login")
  })

  .post(function(req, res){
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({email: username}, function(err, foundUSer){
      if (err) {
        console.log(err);
      }else {
        if (foundUSer) {
          if (foundUSer.password === password) {
            res.render("secrets")
          }
        }
      }
    })

  });


app.route("/register")
  .get(function(req, res){
    res.render("register")
  })

  .post(function(req, res){
    const newUser = new User({
      email: req.body.username,
      password:req.body.password
    });
    newUser.save(function(err){
      if (err) {
        console.log(err);
      }else {
        res.render("secrets")
      }
    })
  });

  app.route("/")
    .get(function(req, res){
      res.render("home")
    });

//
// app.route("/secrets")
//   .get(function(req, res){
//     res.render("serets")
//   });


app.route("/submit")
  .get(function(req, res){
    res.render("submit")
  });



app.listen(3000,function(){
  console.log("Server started on port 3000");
})
