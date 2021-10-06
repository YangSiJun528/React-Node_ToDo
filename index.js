const express = require('express')
const dotenv = require('dotenv')
const app = express()
const PORT = process.env.port || 8000
const path = require('path')
const { send } = require('process')
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const { User } = require('./models/User.js')
const { auth } = require('./middleware/auth.js')

//환경변수 설정
require('dotenv').config(
  dotenv.config({
    path: path.resolve(
      process.cwd(),
      process.env.NODE_ENV == "production" ? ".env" : ".env.dev"
    )
  }));
//process.env.NODE_ENV는 출력하면 실제로 값이 있더라도 undefined로 나옴

app.use(cookieParser());

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
  return res.send('asd')
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
    user.comparePassword(req.body.password, (err, isMatch) => {
      if(!isMatch)
        return res.json({loginSuccess: false, message:'비밀번호가 틀렸습니다.'})
      user.generateToken((err, user) => {
      if(err) return res.status(400).send(err)
        res.cookie('x_auth', user.token).status(200).json({loginSuccess: true, userId: user._id})
      })
    })
  })
})

app.get('/auth', auth, (req, res) => {
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image
  })
})

app.listen(PORT, ()=>{
    console.log(`running on port ${PORT}`);
})