var express= require('express'),
    router= express.Router(),
    bodyParser= require('body-parser'),
    urlencodedParser= bodyParser.urlencoded({extended: false}),
    session= require('express-session'),
    passport= require('passport'),
    LocalStrategy= require('passport-local'),
    query= require('../route/query.js');

router.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}))
router.use(passport.initialize());
router.use(passport.session());
router.use(express.static('publics'));

router.route('/signup')
.get((req,res)=>{
  res.render('register');
})
.post(urlencodedParser, (req,res)=>{
  var newUser= new query({
      fullname: req.body.fname,
      username: req.body.username,
      password: req.body.password
  });
  query.register(newUser, function(err, docs) {
    if(err) res.render('alert',{content: 'Lỗi xảy ra khi truy cập database'});
    else res.redirect("/");
  });
})

router.get('/check/:user', function(req,res) {
  var user= req.params.user;
  user= user.toString();
  query.findUser(user, function(err, docs){
    if(err) res.send("0");
    else
      if(!docs) res.send('1');
      else res.send('0');
  })
});

router.get('/login', (req,res)=>{
  res.render('login',{content:''});
});

router.get('/loginfalse', (req,res)=>{
  res.render('login', {content: 'Tên đăng nhập hoặc mật khẩu sai'});
});

router.post('/login', urlencodedParser,
  passport.authenticate('local',{
    successRedirect:'/',
    failureRedirect:'./loginfalse'
  })
);

passport.use(new LocalStrategy(
  function(username, password, done) {
    query.findUser(username, function(err, docs) {
      if (err) return done(err);
      if (!docs) return done(null, false);
      query.confirm(password, docs.password, function(err, match){
        if(err) return done(err);
        if(match) return done(null, docs);
        return done(null, false);
      });
    });
  }
));
passport.serializeUser(function(user, done) {
  done(null, user.id)
});
passport.deserializeUser(function(id, done) {
  query.findId(id, (err, docs) => done(err, docs));
});

router.get('/logout', function (req,res) {
  req.logout();
  res.redirect('/');
});

module.exports = router;
