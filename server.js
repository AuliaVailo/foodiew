const dotenv = require('dotenv');
const express = require('express')
const app   = express()
const http  = require('http').createServer(app)

dotenv.config();

app.use('/assets', express.static('assets'))

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

app.get('/profile', function(req, res){
    res.sendFile(__dirname + '/profile.html');
});

http.listen(process.env.PORT, function() {
    console.log('listening on *:' + process.env.PORT)
})