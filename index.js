//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');



const homeStartingContent = "Green Warrior Challenge is a monthly competition where Participants have to come up with practical solutions for some of the current real world environmental issues. Problem statement will be released during the beginning of every month and the participants will have over a week of time to pitch in their solutions.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
mongoose.connect('mongodb+srv://g2c2:uvce@cluster0.55ojnes.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser : true, useUnifiedTopology : true})

const postSchema = {
  title: String,
  question: String,
  winner: String,
  content: String
};

const adminSchema = {
  email: String,
  password: String,
}

const Post = mongoose.model("Post", postSchema);
const Admin = mongoose.model("Admin", adminSchema);


app.get("/", function(req, res){
  res.render("first");
});


app.get("/challenge", function(req, res){

  Post.find({}, function(err, posts){
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts
      });
  });
});



app.get("/compose", function(req, res){
  res.render("compose");
});


app.post("/compose", function(req, res){
  const post = new Post({
    title: req.body.postTitle,
    question:req.body.questionTitle,
    winner:req.body.winnerTitle,
    content: req.body.postBody
  });


  post.save(function(err){
    if (!err){
        res.redirect("/challenge");
    }
  });
});


app.post('/signin', function(req, res){
  let reqemail = req.body.email;
  let password = req.body.password;

  // Admin.findOne({email: reqemail}, (err, admin) => {
  //   if (err) throw err;
  //   if(admin.password === password){
  //     localStorage.setItem('user', 'ADMIN');
  //     res.redirect('/compose');
  //   }
  //   else{
  //     res.redirect('/signin');
  //   }
  // })

  console.log(reqemail + ' ' + password);
  res.render('signin');
})

app.get('/signin', function(req, res){
  res.render('signin');
});

app.post("/home", function(req, res){
  res.redirect("/");
});


app.post("/first", function(req, res){
  res.redirect("/challenge");
});


app.get("/posts/:postName", function(req, res){

const requestedPostId = req.params.postName;

  Post.findOne({_id: requestedPostId}, function(err, post){
    if(err){
      console.log(err);
    }
    res.render("post", {
      title: post.title,
      question:post.question,
      winner: post.winner,
      content: post.content
    });
  });

});


const port = 5000;


app.listen(port, function() {
  console.log(`Server started on port ${port}`);
});


module.exports = app;