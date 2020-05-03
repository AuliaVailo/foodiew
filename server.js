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

app.get('/mycafe', function(req, res){
    res.sendFile(__dirname + '/profile_cafe.html');
});

app.get('/profile-cafe', function(req, res){
    res.sendFile(__dirname + '/profile_cafe_visitor.html');
});

app.get('/profile-user', function(req, res){
    res.sendFile(__dirname + '/profile_visitor.html');
});

app.get('/promo', function(req, res){
    res.sendFile(__dirname + '/promo.html');
});

app.get('/halloffame', function(req, res){
    res.sendFile(__dirname + '/halloffame.html');
});

app.get('/contact-us', function(req, res){
    res.sendFile(__dirname + '/contact-us.html');
});

http.listen(process.env.PORT, function() {
    console.log('listening on http://localhost:' + process.env.PORT)
})