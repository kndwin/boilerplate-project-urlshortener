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
    "urlGiven": {
        type: String,
        required: true
    },
    "shortUrl": Number
});
const Url = mongoose.model('Url', urlSchema);
app.use(cors());

var done = (err, data) => {
    if (err) {
        console.log(err);
    } else {
        console.log("Completed: " + data);
    }
}


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


app.post("/api/shorturl/new", function( req,res ) {
    Url.countDocuments( 'urls', (err, count) => { 
        Url.create( 
            { 
            "urlGiven": req.body.url,
            "shortUrl": count
            }, 
            (err, data) => (err ? done(err) : done(null, data))
        );
        res.json({ 
            "orginal_url": req.body.url,
            "short_url": "https://kndwin-fcc-urlshortner.herokuapp.com/api/shorturl/" + count
        })
        err ? done(err) : done(null, count) 
    });
})

app.get("/api/shorturl/:id", function (req, res) {
    Url.findOne( { shortUrl: req.params.id }, (err, urlFound) => {
        res.redirect(urlFound.urlGiven);
        err ? done(err) : done(null, urlFound);
    })
    
})

app.listen(port, function () {
  console.log('Node.js listening ...');
});
