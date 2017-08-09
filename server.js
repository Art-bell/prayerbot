function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}
function existsInArray(array, item) {
    return array.indexOf(item.toLowerCase()) > -1;
}
var request = require('request'); //Module for requesting web pages
var cheerio = require('cheerio'); //Module used for crawling
require("jsdom-no-contextify").env("", function(err, window) { //JQuery module used to make Ajax calls in this app
    if (err) {
        console.error(err);
        return;
    }

    $ = require("jquery")(window);

});

var path = require("path");
// require express and create the express app
var express = require("express");
var mongoose = require('mongoose');

if (process.env.APP_CONFIG == undefined){
  //Database use for server
   mongoose.connect('mongodb://localhost/gtprayerbot');
  var PrayerSchema = new mongoose.Schema({
   category: String,
   value: String
  })
  var Prayer = mongoose.model('all_entries', PrayerSchema);

  var Random_prayerSchema = new mongoose.Schema({
   value: String
  })
  var Random_prayer = mongoose.model('random_prayers', Random_prayerSchema);
}
else { 
  //Database use for localhost
  var config=JSON.parse(process.env.APP_CONFIG);
  var mongoPassword = 'Arthurmide98';
  mongoose.connect("mongodb://" + config.mongo.user + ":" + mongoPassword + "@" +config.mongo.hostString);
  var PrayerSchema = new mongoose.Schema({
   category: String,
   value: String
  })
  var Prayer = mongoose.model('all_entries', PrayerSchema);

  var Random_prayerSchema = new mongoose.Schema({
   value: String
  })
  var Random_prayer = mongoose.model('random_prayers', Random_prayerSchema);
}

// var config=JSON.parse(process.env.APP_CONFIG);
// var mongoPassword = 'Arthurmide98';
// mongoose.connect("mongodb://" + config.mongo.user + ":" + mongoPassword + "@" +config.mongo.hostString);
// var EntrySchema = new mongoose.Schema({
//  category: String,
//  value: String
// })
// var Entry = mongoose.model('all_entries', EntrySchema);



var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest; 
var app = express();
// require bodyParser since we need to handle post data for adding a user
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// static content
app.use(express.static(path.join(__dirname, "./static")));
// set the views folder and set up ejs
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');
app.use( express.static( "public" ) );
// root route
app.get('/', function(req, res) {
 res.render('indexpage');
})
app.get('/add_to_bot', function(req, res) {
  Prayer.find({}, function (err, prayers){
        // loads a view called 'user.ejs' and passed the user object to the view!
        res.render('add_to_bot', {prayers, prayers});
    }).sort({_id:-1})
 
})
app.get('/add_random_prayer_to_bot', function(req, res) {
  Random_prayer.find({}, function (err, prayers){
        // loads a view called 'user.ejs' and passed the user object to the view!
        res.render('add_random_prayer_to_bot', {prayers, prayers});
    }).sort({_id:-1})
 
})
app.post('/make_entry', function(req, res) {
  var newPrayer = new Prayer({category: req.body.category, value: req.body.value});
    // try to save that new user to the database (this is the method that actually inserts into the db) and run a callback function with an error (if any) from the operation.
    newPrayer.save(function(err) {
        res.redirect('/');
      
    })
})
app.post('/make_random_prayer', function(req, res) {
  var newRandom_prayer = new Random_prayer({value: req.body.value});
    // try to save that new user to the database (this is the method that actually inserts into the db) and run a callback function with an error (if any) from the operation.
    newRandom_prayer.save(function(err) {
        res.redirect('/');
      
    })
})
app.post('/update_entry', function(req, res) {
  Prayer.update({category: req.body.old_category}, {category: req.body.new_category, value: req.body.new_value}, function (err, entry){
        res.redirect('/');
    })
})

app.post('/update_random_prayer', function(req, res) {
  Random_prayer.update({value: req.body.old_value}, {value: req.body.new_value}, function (err, entry){
        res.redirect('/');
    })
})

app.post('/remove_entry', function(req, res) {
  Prayer.remove({category: req.body.category}, function (err, user){
    res.redirect('/');
  })
})

app.post('/remove_random_prayer', function(req, res) {
  Random_prayer.remove({value: req.body.old_value}, function (err, user){
    res.redirect('/');
  })
})
//process.env.PORT will use the browsers port
var server = app.listen(process.env.PORT || 8000, function() {
 console.log("listening on port 8000");
 // navigator.geolocation.getCurrentPosition(function(location) {

 //          console.log(location.coords.latitude);
 //          console.log(location.coords.longitude);
 //          console.log(location.coords.accuracy);
        
 //        });
})

//Constants for WIT ai
const {Wit, log} = require('node-wit');
const client = new Wit({accessToken: 'JKPIUORTPIE23AYC572H2PKDU5IUS52B'});



var io = require('socket.io').listen(server) 
io.sockets.on('connection', function (socket) {

  function chooser(){
      var selector = getRandomInt(0,4);
      if (selector == 1){
        socket.emit('server_response', {response: "May the Lord bless you today"});
        socket.emit('server_response', {response: "What would you like the Lord to help you with today? or which area in your life needs healing?", flag: true});
        socket.emit('button_options', {response: "<div class='options_holder'><div class='horizontal_move'><button class='option' >Relationship Issues</button><button class='option'>Financial Troubles</button><button class='option'>Loneliness</button><button class='option'>Worries</button><button class='option'>Depression</button><button class='option'>In Danger</button><button class='option'>Lack of Faith</button><button class='option'>In Need of Courage</button><button class='option'>Seeking Peace</button><button class='option'>Leaving For A Trip</button><button class='option'>Recovering From A Loss</button><button class='option'>Weakness</button></div></div>"});
      }
      else if (selector == 2){
        socket.emit('server_response', {response: "The Lord is our strength"});
        socket.emit('server_response', {response: "What would you like the Lord to help you with today? or which area in your life needs healing?", flag: true});
        socket.emit('button_options', {response: "<div class='options_holder'><div class='horizontal_move'><button class='option' >Relationship Issues</button><button class='option'>Financial Troubles</button><button class='option'>Loneliness</button><button class='option'>Worries</button><button class='option'>Depression</button><button class='option'>In Danger</button><button class='option'>Lack of Faith</button><button class='option'>In Need of Courage</button><button class='option'>Seeking Peace</button><button class='option'>Leaving For A Trip</button><button class='option'>Recovering From A Loss</button><button class='option'>Weakness</button></div></div>"});
      }
      else if (selector == 3){
        socket.emit('server_response', {response: "May the blessings in your life continue to multiply"});
        socket.emit('server_response', {response: "What would you like the Lord to help you with today? or which area in your life needs healing?", flag: true});
        socket.emit('button_options', {response: "<div class='options_holder'><div class='horizontal_move'><button class='option' >Relationship Issues</button><button class='option'>Financial Troubles</button><button class='option'>Loneliness</button><button class='option'>Worries</button><button class='option'>Depression</button><button class='option'>In Danger</button><button class='option'>Lack of Faith</button><button class='option'>In Need of Courage</button><button class='option'>Seeking Peace</button><button class='option'>Leaving For A Trip</button><button class='option'>Recovering From A Loss</button><button class='option'>Weakness</button></div></div>"});
      }
      else {
        socket.emit('server_response', {response: "I pray the Lord continues to order your footsteps in the path of righteousness today"});
        socket.emit('server_response', {response: "What would you like the Lord to help you with today? or which area in your life needs healing?", flag: true});
        socket.emit('button_options', {response: "<div class='options_holder'><div class='horizontal_move'><button class='option' >Relationship Issues</button><button class='option'>Financial Troubles</button><button class='option'>Loneliness</button><button class='option'>Worries</button><button class='option'>Depression</button><button class='option'>In Danger</button><button class='option'>Lack of Faith</button><button class='option'>In Need of Courage</button><button class='option'>Seeking Peace</button><button class='option'>Leaving For A Trip</button><button class='option'>Recovering From A Loss</button><button class='option'>Weakness</button></div></div>"});
      }
  }
  chooser()

  console.log(socket.id);
  //This is used to capture any text that the user sends from the input box.
  socket.on("user_sent", function (dataA){
    client.message(dataA.reason, {})
      .then((data) => {
        if(Object.keys(data.entities) == "greetings"){
          chooser()
        }
        else if(Object.keys(data.entities) == "prayer_category"){
          var ind
          //Detailed explanation: The database used in the project is MongoDB, which is ideal for NodeJS apps;
          //The collection used below is the 'prayer' collection. It has two columns: category & value.
          //The category column is the column which must match the category that you have specified in Wit.ai
          //or whatever translation api you have used. It is also recommended to use underscores in place of spaces.
          //The value column will be whatever you want the bot to send back to the user. You may notice that
          //in this projects database, some value columns start with '<span>' or '<img>'. This is because
          //the value contains an image that will be sent to the user as well as text. You may also notice words like '&#x61736'
          //These words are unicode for Emojis and you can google more info on them.
          Prayer.find({},function (err, prayer){ //This function will get every single prayer from our database
              for (ind in prayer){ //This for loop will loop through each funciton
                if (prayer[ind].category == data.entities.prayer_category[0].value.toLowerCase()){  //This if statement will then check to see if the category is the same as the one which Wit.ai has returned back after analyzing the users text
                  socket.emit('server_response', {response: prayer[ind].value}); //It will then send the value you have specified for that category back to the user through the Bot.
                }
              }
              // res.render('user', {user: user});
          })
        }
        else if (Object.keys(data.entities) == "intent"){
          var count = 0;
          var indb
          
          Random_prayer.find({},function (err, prayer){ //This function will get every single prayer from our database
              var random_int = getRandomInt(0,prayer.length);
              for (indb in prayer){ //This for loop will loop through each funciton
                if (count == random_int){  //This if statement will then check to see if the category is the same as the one which Wit.ai has returned back after analyzing the users text
                  socket.emit('server_response', {response: prayer[indb].value}); //It will then send the value you have specified for that category back to the user through the Bot.
                }
                count++
              }
              // res.render('user', {user: user});
          })
        }
        else if (Object.keys(data.entities).length == 0){
          socket.emit('server_response', {response: "I didn't quite understand that, here are some options you can choose from:", flag: true})
          socket.emit('button_options', {response: "<div class='options_holder'><div class='horizontal_move'><button class='option' >Relationship Issues</button><button class='option'>Financial Troubles</button><button class='option'>Loneliness</button><button class='option'>Worries</button><button class='option'>Depression</button><button class='option'>In Danger</button><button class='option'>Lack of Faith</button><button class='option'>In Need of Courage</button><button class='option'>Seeking Peace</button><button class='option'>Leaving For A Trip</button><button class='option'>Recovering From A Loss</button><button class='option'>Weakness</button></div></div>"});
        }
      })
    
  })
  socket.on("option", function (dataA){
    client.message(dataA.reason, {})
      .then((data) => {
        if(Object.keys(data.entities) == "prayer_category"){
          var ind
          //Detailed explanation: The database used in the project is MongoDB, which is ideal for NodeJS apps;
          //The collection used below is the 'prayer' collection. It has two columns: category & value.
          //The category column is the column which must match the category that you have specified in Wit.ai
          //or whatever translation api you have used.
          //The value column will be whatever you want the bot to send back to the user. You may notice that
          //in this projects database, some value columns start with '<span>' or '<img>'. This is because
          //the value contains an image that will be sent to the user as well as text. You may also notice words like '&#x61736'
          //These words are unicode for Emojis and you can google more info on them.
          Prayer.find({},function (err, prayer){ //This function will get every single prayer from our database
              for (ind in prayer){ //This for loop will loop through each funciton
                if (prayer[ind].category == data.entities.prayer_category[0].value.toLowerCase()){  //This if statement will then check to see if the category is the same as the one which Wit.ai has returned back after analyzing the users text
                  socket.emit('server_response', {response: prayer[ind].value}); //It will then send the value you have specified for that category back to the user through the Bot.
                }
              }
              // res.render('user', {user: user});
          })
        }
      })
  })
  socket.on("get_verse", function(dataA){ 
    var return_text = ""
    $.getJSON('https://bible-api.com/'+dataA.reason.split(":")[0]+"?translation=kjv", function(dataB){
        for (i = 0; i < dataB.verses.length; i++){
        return_text += "<b style='font-size: 25px'>Verse:" + dataB.verses[i].verse + "</b>"
        return_text += "<br>"
        return_text += dataB.verses[i].text + "<br><br>"
      }
      socket.emit('returned_verses', {response: return_text})
    })
    
  })
})


