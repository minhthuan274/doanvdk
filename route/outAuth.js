var express= require('express'),
    router= express.Router(),
    bodyParser= require('body-parser'),
    urlencodedParser= bodyParser.urlencoded({extended: false}),
    //query= require('../route/query.js'),
    room= require('../route/room.js');
module.exports = router;
router.get("/", ensureAuth, function(req,res) {
  res.render('setting', {name: req.user.fullname});
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

router.get("/edit/:id", ensureAuth, function(req, res) {
  id= req.params.id;
  room.findByIdUser(id, (err, doc)=>{
    if(err) res.render('login',{content: 'Lỗi DATABASE'});
    else{
      res.render('editSetting',{data: doc});
    }
  });
})

function ensureAuth(req,res,next) {
  if(req.isAuthenticated()) return next();
  res.redirect('login');
}
