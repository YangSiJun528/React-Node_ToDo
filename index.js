const express = require('express')
const app = express()
const PORT = process.env.port || 8000
const path = require('path')
const { send } = require('process')


app.use(express.urlencoded({extended: true})) 

const http = require('http').createServer(app)

// app.use(express.static(path.join(__dirname, '')));

app.get('/', (req, res) => {
  res.send("start")
})

app.listen(PORT, ()=>{
    console.log(`running on port ${PORT}`);
})