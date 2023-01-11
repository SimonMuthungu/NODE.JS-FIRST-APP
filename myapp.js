let express = require('express');
let app = express();
let bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: false}))



let absolutePath = __dirname + '/views/index.html'
let staticPath = __dirname + '/public'

app.use('*', function (req, res, next) {
  console.log(req.method, req.path, "-", req.ip);
  next();
})

app.use('/public', express.static(staticPath))

app.get('/now', function (req, res, next) {
  const date = new Date().toString();
  req.time = date;
  next();
}, function (req, res) {
  res.json({"time": req.time});
});

app.get('/', function(req, res){
  res.sendFile(absolutePath)
})

let mySecret = process.env['MESSAGE_STYLE']

app.get('/json', function(req, res) {
  let mySecret = process.env['MESSAGE_STYLE']
  if (mySecret == 'uppercase') {
    res.json({"message": "HELLO JSON"})
  } else {
    res.json({"message": "Hello json"}) 
  }
})

//working with parameters
app.get('/:word/echo', function(req, res) {
  res.json({"echo": req.params.word})
})

//form (post) submissions
app.post('/name', function(req, res) {
  res.json({"name": req.body.first + " " + req.body.last}) 
})



 module.exports = app;
