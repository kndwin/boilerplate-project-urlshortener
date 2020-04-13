'use strict';

var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

var cors = require('cors');

var app = express();

// Basic Configuration 
var port = process.env.PORT || 3000;

/** this project needs a db !! **/ 
// mongoose.connect(process.env.DB_URI);
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
console.log(process.env.MONGO_URI);

mongoose.connect(
    process.env.MONGO_URI,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
);

const Schema = mongoose.Schema;
const urlSchema = new Schema ({
    urlGiven: {
        type: String,
        required: true
    },
    urlShortened: String
});
const Url = mongoose.model('Url', urlSchema);

app.use(cors());

/** this project needs to parse POST bodies **/
// you should mount the body-parser here
app.use(
    bodyParser.urlencoded({ extended: false  }),
    bodyParser.json()
);

app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});

  
// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});

app.route("/api/shorturl/new").get(function(req, res){
    res.json({ "url": req.query })
}).post(function(req, res){
    console.log(req.body)
    res.json({ "url": req.body })
})

app.listen(port, function () {
  console.log('Node.js listening ...');
});
