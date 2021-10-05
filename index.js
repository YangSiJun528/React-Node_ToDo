const express = require('express')
const dotenv = require('dotenv')
const jwt = require('jsonwebtoken')
const app = express()
const PORT = process.env.port || 8000
const path = require('path')
const { send } = require('process')
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const { User } = require('./models/User.js')

//환경변수 설정
require('dotenv').config(
  dotenv.config({
    path: path.resolve(
      process.cwd(),
      process.env.NODE_ENV == "production" ? ".env" : ".env.dev"
    )
  }));
//process.env.NODE_ENV는 출력하면 실제로 값이 있더라도 undefined로 나옴


//application/x-www-form-urlencoded
app.use(express.urlencoded( {extended : false } ));
//application/json
app.use(express.json()); 

//DB 불러오는 코드
mongoose.connect(process.env.MONGO_URI
//, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false }
  )
  .then( () => {console.log('mongoose is ready!!!')
}).catch( (err) => {console.log(err)})

// app.use(express.urlencoded({extended: true})) 

const http = require('http').createServer(app)

// app.use(express.static(path.join(__dirname, '')));

// // 환경변수 확인하는 코드
// app.get('/', (req, res) => {
//   res.send(process.env.mode)
// })

app.get('/', (req, res) => {
  res.send()
})

app.post('/register', (req, res) => {
  const user = new User(req.body)
  user.save((err,doc) => {
    if (err) { return res.json({success: false, err})}
    return res.status(200).json({success: true})
  })
})

app.post('/login', (req, res) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if(!user)
      return res.json({loginSuccess: false, message:'제공된 이메일에 맞는 유저가 없습니다.'})
  })

  user.comparePassword(res.body.password, (err,isMatch) => {
    if(!isMatch)
      return res.json({loginSuccess: false, message:'비밀번호가 틀렸습니다.'})
  })

  user.generateToken((err, user) => {

  })
})

app.listen(PORT, ()=>{
    console.log(`running on port ${PORT}`);
})