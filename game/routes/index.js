var express = require('express');
var router = express.Router();

/* Set up mongoose in order to connect to mongo database */
var mongoose = require('mongoose'); //Adds mongoose as a usable dependency

mongoose.connect('mongodb://localhost/commentDB',{ useNewUrlParser: true }); //Connects to a mongo database called "commentDB"

var scoreSchema = mongoose.Schema({ //Defines the Schema for this database
    Name: String,
    Score: String
});

var Comment = mongoose.model('Score', scoreSchema); //Makes an object from that schema as a model

var db = mongoose.connection; //Saves the connection as a variable to use
db.on('error', console.error.bind(console, 'connection error:')); //Checks for connection errors
db.once('open', function() { //Lets us know when we're connected
    console.log('Connected');
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET comments from database */
router.get('/score', function(req, res, next) {
    console.log("In the GET route");
    console.log(req.query);
    var qname=req.query.name;
    var obj={};
    if(qname){
      obj={Name:qname};
    }
    Comment.find(obj, function(err,scoreList) { //Calls the find() method on your database
      if (err) return console.error(err); //If there's an error, print it out
      else {
        console.log(scoreList); //Otherwise console log the comments you found
        res.json(scoreList); //Then send the comments
      }
    })
});

router.post('/Score', function(req, res, next) {
    console.log("POST comment route"); 
    //console.log(req.body);
    var newscore = new Score(req.body); 
    console.log(newscore); 
    newscore.save(function(err, post) { 
      if (err) return console.error(err);
      console.log(post);
      res.sendStatus(200);
    });
});

router.delete('/score', function(req, res, next) {
    console.log("DELETE comment route"); 
    Comment.find(function(err,commentList) { //Calls the find() method on your database
      if (err) return console.error(err); //If there's an error, print it out
      else {
        console.log(commentList); //Otherwise console log the comments you found
        for(let comment of commentList){
          console.log(comment);
          Comment.deleteOne(comment,function(err,obj) {
            if (err) return console.error(err);
            console.log(obj.result);
          })
        }
        res.sendStatus(204);
      }
    })
});

module.exports = router;
