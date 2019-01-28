const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const schemas = require(__dirname + '/schemas.js')

app.use(cors())

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())


app.use(express.static('public'))

const User = schemas.User;
const Exercise = schemas.Exercise;
const dateReg = /^\d{4}-\d{2}-\d{2}$/

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.post('/api/exercise/new-user', (req, res) => {
  let name = req.body.username;

  User.find({}, function(err, users){
    users.forEach(function(user){
      if (name === user.username) {
        res.send('User has already been added');
      } 
    })
    
    const user = new User ({
      username: name
    })
  
    user.save()
    res.json({username: user.username, _id: user._id});
  })
})

app.get('/api/exercise/log/:userId', (req, res) => {
  let userId = req.params.userId;

  User.findOne({_id: userId}, function (err, user){
    if (err) {
      res.send('Unknown userId');
    } else {
      res.json({username: user.username, _id: user._id});
    }
  })
})

app.post('/api/exercise/add', (req, res) => {
  let userId = req.body.userId;
  let description = req.body.description;
  let duration = req.body.duration;
  let date = req.body.date;

  User.findOne({_id: userId}, function (err, user) {

    if (err) {
      res.send('Unknown userId');
    } else if (!date.match(dateReg)){ 
      res.send('Invalid date format');
    } else if (date == null){
      res.send('Date is required');
    } else if (userId == ''){
      res.send('UserId is required');
    } else {

      username = user.username

      const exercise = new Exercise ({
        username: username,
        description: description,
        duration: duration,
        date: date
      })
    
      exercise.save()
    
      res.json({username: exercise.username,
        description: exercise.description,
        duration: exercise.duration,
        _id: exercise._id,
        date: exercise.date});
    }
  });
})

// Not found middleware
app.use((req, res, next) => {
  return next({status: 404, message: 'not found'})
})

// Error Handling middleware
app.use((err, req, res, next) => {
  let errCode, errMessage

  if (err.errors) {
    // mongoose validation error
    errCode = 400 // bad request
    const keys = Object.keys(err.errors)
    // report the first validation error
    errMessage = err.errors[keys[0]].message
  } else {
    // generic or custom error
    errCode = err.status || 500
    errMessage = err.message || 'Internal Server Error'
  }
  res.status(errCode).type('txt')
    .send(errMessage)
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
