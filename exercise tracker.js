const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
require('dotenv').config()
const mongoose = require('mongoose');

const userSchema = new Schema({
  "username": String
})

const exerciseSchema = new Schema({
  "username": String,
  "date": Date,
  "duration": Number,
  "description": String,
})

const logSchema = new Schema({
  "username": String,
  "count": Number,
  "log": Array
})

//models
const userInfo = mongoose.model('userInfo', userSchema);
const exerciseInfo = mongoose.model('exerciseInfo', exerciseSchema);
const logInfo = mongoose.model('logInfo', logSchema);


  //connecting to atlas
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true }, () => {console.log('Connected to mongo db')});

//middleware
app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use(cors())
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

//api endpoints

app.post('/api/users', (req, res) => {
  userInfo.find({"username": req.body.username}, (err, userData) => {
    if (err) {
      console.log('error: ',err)
    } else{
      if (userData.length === 0) {
        const test = new userInfo({
          '_id': req.body.id,
          'username': req.body.username
        })
        test.save((err, data) => {
          if (err) {console.log('error: ',err)}
          else {
            res.json({
              '_id': data.id,
              'username': data.username
            })
          }
        })
      } else {
        res.send('Username exists')
      }
    }
  })
})



const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
