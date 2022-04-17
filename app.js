// jshint esversion:6

const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static('public'));
app.set('view engine', 'ejs');
mongoose.connect('mongodb://localhost:27017/blogDB');

// posts = [];

const postSchema = new mongoose.Schema({
    title : {
        type : String,
        required : [1, 'A title must be entered']
    },

    content : {
        type : String,
        required : [1, 'Content cannot be blank']
    }
});

const Post = mongoose.model('Post', postSchema);

app.get('/', (req,res) => {
    Post.find({}, (err, posts) => {
        if(!posts.length){
            res.render(__dirname + '/views/home', {posts:[]});
        }else{
            res.render(__dirname + '/views/home', {posts: posts});
        }
    })
    
});

app.post('/', (req,res) => {
    let title = req.body.title;
    let fistLetter = title.slice(0,1).toUpperCase();
    let remainingLetters = title.slice(1,title.length).toLowerCase();
    title = fistLetter + remainingLetters;
    let blogPost = req.body.compose;
    let post = new Post({
        title : title,
        content : blogPost
    })
    Post.create(post, (err) => console.log(err));
    res.redirect('/');
});

app.get('/compose', (req,res) => {
    res.render(__dirname + '/views/compose');
});

app.get('/post:title', (req,res) => {
    let title = req.params.title;
    Post.find({title : title}, (err, post) => {
        res.render(__dirname + '/views/post', {post: post});
    })   
});



app.listen(PORT, () => console.log('Server is running on port ' + PORT));