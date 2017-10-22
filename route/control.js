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
      // {"_id":"59ceb2ab498e6f376c0336b5",
      // "userId":"59be2f744dde851be42b637d",
      // "name":"ESP8266 nhà Tùng",
      // "output1":"Light room","__v":0,
      // "valin2":0,
      // "input2":"nhiet do",
      // "valin1":0,
      // "input1":"do am",
      // "valout3":1,
      // "output3":"tv",
      // "valout2":0,
      // "output2":"Fan",
      // "valout1":1}
    }
  });
});
