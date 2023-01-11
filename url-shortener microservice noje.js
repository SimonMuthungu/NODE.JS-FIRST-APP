require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require ('body-parser');
const mongoose = require('mongoose');
const dns = require('dns');
const urlparser = require('url');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
console.log(mongoose.connection.readyState)

const schema = new mongoose.Schema({ url: 'string'});
const Url = mongoose.model('Url', schema);

app.use(bodyParser.urlencoded({extended: false}))
app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.post('/api/shorturl', function(req, res) {
  console.log(req.body);
  const bodyurl = req.body.url;
  
  const something = dns.lookup(urlparser.parse(bodyurl).hostname,(error, address) => {
    if (!address) {
      res.json({error: "Invalid URL" })
    } else {
      const url = new Url({url: bodyurl })
      url.save((err, data) => {
        res.json({
          original_url: data.url,
          short_url: data.id
        })
      })
    }
    console.log('dns', error);
    console.log('address', address);
  })
  });

app.get("/api/shorturl/:id", (req,res) => {
  const id = req.params.id;
  Url.findById(id, (err, data) => {
    if (!data){
      res.json({error: "Invalid URL"})
    } else {
      res.redirect(data.url)
    }
  })
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
