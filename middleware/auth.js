const req = require('express/lib/request');
const { User } = require('../models/User')

let auth = (res, req, next) => {
  let token = res.cookies.x_auth

  User.findByToken(token, (err, user)=>{
    if (err) throw err;
    if (!user) return res.json({ isAuth: false, error: true })
    // 바깥에서 req.token 이나 req.user 를 사용해 정보를 쉽게 찾을 수 있게 도와줌
    req.token = token
    req.user = user
    next();
  })
}

module.exports = { auth }