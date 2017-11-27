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

router.get('/test', function(req,res) {
  res.render('socket');
})

router.get("/:id"+".json", function(req,res) {
  var id= req.params.id;
  room.findById(id, (err, data)=>{
    if (err) res.render('alert', {content: 'Database was errored'});
    else {
      res.send({
        id: data._id,
        valin1: data.valin1,
        valin2: data.valin2,
        valout1: data.valout1,
        valout2: data.valout2,
        valout3: data.valout3
      });
    }
  });
});
