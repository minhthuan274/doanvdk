var express= require('express'),
    router= express.Router(),
    room= require('./room.js'),
    bodyParser= require('body-parser'),
    urlencodedParser= bodyParser.urlencoded({extended: false});

function ensureAuth(req,res,next) {
  if(req.isAuthenticated()) return next();
  res.redirect('../login');
}

module.exports = router;
// app.use('/control', require('./route/control.js'));
router.use(express.static("publics"));

// view All Equip, choose to edit and control
router.get("/", ensureAuth, function(req,res) {
  room.findByIdUser(req.user._id, (err, docs)=>{
    if (err) res.render('alert', {content: 'Database was errored'});
    else {
      res.render('controlSocket', {name: req.user.fullname, id: req.user._id , data: docs});
    }
  });
});

router.get("/:id"+"json", function(req,res) {
  var id= req.params.id;
  room.findById(id, (err, docs)=>{
    if (err) res.render('alert', {content: 'Database was errored'});
    else {
      res.send(docs);
    }
  });
});
