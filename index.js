require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyparser = require('body-parser');

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyparser.urlencoded({extended: false}));

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});
// My code
let urlDatabase = [];
app.get('/api/shorturl', function(req, res) {
  const url = req.body.url;
  let urlRegex = /^https?:\/\/www\./;
  if (!urlRegex.test(url)) {
    res.json({error: 'invalid url'});
  } else {
    let shortUrl = Math.floor(Math.random() * 100).toString();
    let urlObj = {
      original_url: url,
      short_url: shortUrl
    };
    urlDatabase.push(urlObj);
    res.send(urlObj);
  }
})

app.get('/api/shorturl/:short_url', function(req, res) {
  let shortUrl = req.params.short_url;
  let urlObj = urlDatabase.find((obj) => {
    return obj.short_url === shortUrl;
  }
  );
  if (urlObj) {
    res.redirect(urlObj.original_url)
  } else {
    res.json({error: 'No short url found for given input'});
  }
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
