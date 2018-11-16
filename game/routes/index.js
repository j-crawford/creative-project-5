var express = require('express');
var router = express.Router();

/* Set up mongoose in order to connect to mongo database */
var mongoose = require('mongoose'); //Adds mongoose as a usable dependency

mongoose.connect('mongodb://localhost/commentDB',{ useNewUrlParser: true }); //Connects to a mongo database called "commentDB"

var imageSchema = mongoose.Schema({ //Defines the Schema for this database
    Name: String,
    UserImage: String,
    Image: String
});

var Image = mongoose.model('Image', imageSchema); //Makes an object from that schema as a model

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
router.get('/image', function(req, res, next) {
    console.log("In the GET route");
    console.log(req.query);
    var qname=req.query.name;
    var obj={};
    if(qname){
      obj={Name:qname};
    }
    Image.find(obj, function(err,imageList) { //Calls the find() method on your database
      if (err) return console.error(err); //If there's an error, print it out
      else {
        console.log(imageList); //Otherwise console log the comments you found
        res.json(imageList); //Then send the comments
      }
    })
});

router.post('/image', function(req, res, next) {
    console.log("POST score route"); 
    //console.log(req.body);
    var newimage = new Image(req.body); 
    console.log(newimage); 
    newimage.save(function(err, post) { 
      if (err) return console.error(err);
      console.log(post);
      res.sendStatus(200);
    });
});

router.delete('/image', function(req, res, next) {
    console.log("DELETE score route"); 
    Image.find(function(err,imageList) { //Calls the find() method on your database
      if (err) return console.error(err); //If there's an error, print it out
      else {
        console.log(imageList); //Otherwise console log the comments you found
        for(var image of imageList){
          console.log(image);
          Image.deleteOne(image,function(err,obj) {
            if (err) return console.error(err);
            console.log(obj.result);
          })
        }
        res.sendStatus(204);
      }
    })
});

module.exports = router;
