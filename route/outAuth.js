var express= require('express'),
    router= express.Router(),
    bodyParser= require('body-parser'),
    urlencodedParser= bodyParser.urlencoded({extended: false}),
    room= require('../route/room.js');

module.exports = router;
// app.use('/setup', require('./route/outAuth.js'));
router.use(express.static("publics"));

function ensureAuth(req,res,next) {
  if(req.isAuthenticated()) return next();
  res.redirect('../login');
}

router.get("/", ensureAuth, function(req,res) {
  room.findByIdUser(req.user._id, (err, docs)=>{
    if(err) res.render('alert', {content: 'Database wasn\' errored'});
    else{
      if(docs.length>=5) res.render('alert', {content: 'You only have a maximum of 5 devices'});
      else res.render('setting', {name: req.user.fullname});
    }
  })
});

router.post("/", urlencodedParser, ensureAuth, function(req,res) {
  var newRoom= new room({
    userId: req.user._id,
    name: req.body.eqname,
    output1: req.body.output1,
    output2: req.body.output2,
    output3: req.body.output3,
    input1: req.body.input1,
    input2: req.body.input2
  });
  room.setup(newRoom, (err, docs)=>{
    if (err)  res.render('login',{content: 'Lỗi DATABASE'});
    else res.redirect('/');
  })
});

router.get("/:id", ensureAuth, function(req, res) {
  var id= req.params.id;
  room.findById(id, (err, doc)=>{
    if(err) res.render('alert',{content: 'Database was errored'});
    else{
      res.render('editSetting',{data: doc, name: req.user.username});
    }
  });
});

router.post("/:id", urlencodedParser, ensureAuth, (req,res)=>{
  var id= req.params.id;
  room.update(
    {
      _id: id,
      userId: req.user._id
    },
    {$set: {
      name: req.body.eqname,
      output1: req.body.output1,
      output2: req.body.output2,
      output3: req.body.output3,
      input1: req.body.input1,
      input2: req.body.input2
    }},
    (err, doc)=>{
      if (err) res.render('alert',{content: "Databse was error when update Equipment"});
      else{
        res.redirect('/control');
      }
    }
  );
});
