const express = require('express')
const app = express()
const PORT = process.env.port || 8000
const path = require('path')
const { send } = require('process')
const mongoose = require('mongoose');

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

app.listen(PORT, ()=>{
    console.log(`running on port ${PORT}`);
})