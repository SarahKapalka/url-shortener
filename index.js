require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const mongoose= require('mongoose');
const bodyParser = require("body-parser");
const urlExists = require("url-exists");

mongoose.connect('mongodb+srv://Yooril:90210gonow@cluster0.udaws.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });

// Basic Configuration
const port = process.env.PORT || 3000;
app.use(bodyParser.urlencoded({ extended: "false" }));
app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

const dataSchema = new mongoose.Schema({
  url: String
});

let Data = mongoose.model('Data', dataSchema);

app.post('/api/shorturl', (req,res)=>{
  const link= req.body.url;
  urlExists(link, function(err, exists) {
    if (exists) {
      let doc = new Data({url: link});
      doc.save((err, data)=>{
        if(err) return console.error(err);
        res.json({original_url: data.url, short_url: data.id})
        console.log("link is set")
      });
      
    } else{
      res.json({ error: 'invalid url' });
    }
  })
});
// Your first API endpoint
app.get('/api/shorturl/:id', function(req, res) {
  let id= req.params.id;
  Data.findById(id, (err,data)=>{
    if (err) return console.error(err);
    res.redirect(data.url)
  })
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
