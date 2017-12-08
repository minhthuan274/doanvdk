var express= require('express'),
    app= express(),
    http= require('http').Server(app),
    io= require('socket.io')(http),
    mongoose= require('mongoose');

mongoose.connect('mongodb://doanvidieukhien:doanvidieukhien@ds159963.mlab.com:59963/doanvdk')
var db= mongoose.connection;

app.use(express.static("publics"));
app.set('view engine','ejs');
app.set('views','./viewBootstrap');
// var port_number = app.listen(process.env.PORT || 3000);
http.listen(process.env.PORT || 3000, function() {
  console.log("On server");
});

require('./route/socket.js')(io);

app.use('/', require('./route/inAuth.js'));
app.use('/setup', require('./route/outAuth.js'));
app.use('/control', require('./route/control.js'));

app.get('/', function (req,res) {
  if (req.isAuthenticated()) {
    res.render('homeAuth', {name: req.user.fullname});
  }else res.render('home');
});

app.get('/socket',(req,res)=>{
  res.render('socket');
});
