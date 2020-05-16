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

app.get('/my-voucher', function(req, res){
    res.sendFile(__dirname + '/my-voucher.html');
});

app.get('/category', function(req, res){
    res.sendFile(__dirname + '/categories_list.html');
});

// category route
app.get('/breads', function(req, res){
    res.sendFile(__dirname + '/breads.html');
});

app.get('/rice', function(req, res){
    res.sendFile(__dirname + '/rice.html');
});

app.get('/noodles', function(req, res){
    res.sendFile(__dirname + '/noodles.html');
});

app.get('/vegefruit', function(req, res){
    res.sendFile(__dirname + '/vegefruit.html');
});

app.get('/cheese', function(req, res){
    res.sendFile(__dirname + '/cheese.html');
});

app.get('/meat', function(req, res){
    res.sendFile(__dirname + '/meat.html');
});

app.get('/fish', function(req, res){
    res.sendFile(__dirname + '/fish.html');
});

app.get('/egg', function(req, res){
    res.sendFile(__dirname + '/egg.html');
});

app.get('/other_food', function(req, res){
    res.sendFile(__dirname + '/other_food.html');
});

app.get('/milk', function(req, res){
    res.sendFile(__dirname + '/milk.html');
});

app.get('/softdrink', function(req, res){
    res.sendFile(__dirname + '/softdrink.html');
});

app.get('/juice', function(req, res){
    res.sendFile(__dirname + '/juice.html');
});

app.get('/beer_wine_cinder_spirits', function(req, res){
    res.sendFile(__dirname + '/beer_wine_cinder_spirits.html');
});

app.get('/tea', function(req, res){
    res.sendFile(__dirname + '/tea.html');
});

app.get('/coffee', function(req, res){
    res.sendFile(__dirname + '/coffee.html');
});

app.get('/hot_chocolatte', function(req, res){
    res.sendFile(__dirname + '/hot_chocolatte.html');
});

app.get('/water', function(req, res){
    res.sendFile(__dirname + '/water.html');
});

app.get('/other_drinks', function(req, res){
    res.sendFile(__dirname + '/other_drinks.html');
});

app.get('/location', function(req, res){
    res.sendFile(__dirname + '/categories_location.html');
});


http.listen(process.env.PORT, function() {
    console.log('listening on http://localhost:' + process.env.PORT)
})