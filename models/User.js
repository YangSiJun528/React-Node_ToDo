const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
// 비밀번호를 해싱하기 전에 유추하기 어렵게 스트링을 추가하는데 이게 salt임
const saltRounds = 10;

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    maxLength: 50
  },
  email: {
    type: String,
    trim: true,
    unique: 1
  },
  password: {
    type: String,
    minLength: 5
  },
  lastname: {
    type: String,
    maxLength: 50
  },
  role: {
    type: Number,
    default: 0
  },
  image: String,
  token: {
    type: String
  },
  tokenExp: {
    type: Number
  }
})

// userSchema.pre() >> save 실행되기 전에 실행됨 (미들웨어같은거)
// 유저 정보 암호화
userSchema.pre('save',(next)=>{
  let user = this
  if(user.isModified('password')){
    bcrypt.genSalt(saltRounds, function(err, salt) {
      if(err) return next(err)
      bcrypt.hash(user.password, salt, function(err, hash) {
        if(err) return next(err)
        user.password = hash
        next()
      })
    })
  } else {
    next()
  }
})

userSchema.methods.comparePassword = (plainPassword, callback) => {
  bcrypt.compare(plainPassword, this.password, (err, isMatch) => {
    if(err) return callback(err)
    callback(null, isMatch)
  })
}

const User = mongoose.model('User',userSchema)

module.exports = { User }