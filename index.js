const express = require('express')
const app = express()
const PORT = process.env.port || 8000
const path = require('path')
const { send } = require('process')
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const { User } = require('./models/User.js')

//application/x-www-form-urlencoded
app.use(express.urlencoded( {extended : false } ));
//application/json
app.use(express.json()); 

mongoose.connect('mongodb+srv://root:1234567890@cluster0.deicx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
//, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false }
  )
  .then( () => {console.log('mongoose is ready!!!')
}).catch( (err) => {console.log(err)})

// app.use(express.urlencoded({extended: true})) 

const http = require('http').createServer(app)

// app.use(express.static(path.join(__dirname, '')));

app.get('/', (req, res) => {
  res.send("start")
})

app.post('/register', (req, res) => {
  const user = new User(req.body)
  user.save((err,doc) => {
    if (err) { return res.json({success: false, err})}
    return res.status(200).json({success: true})
  })
})

app.listen(PORT, ()=>{
    console.log(`running on port ${PORT}`);
})