var express= require('express'),
    router= express.Router(),
    room= require('./room.js');

function ensureAuth(req,res,next) {
  if(req.isAuthenticated()) return next();
  res.redirect('../login');
}

module.exports = router;
// app.use('/control', require('./route/control.js'));
router.use(express.static("publics"));


router.get("/", ensureAuth, function(req,res) {
  room.findByIdUser(req.user._id, (err, docs)=>{
    if (err) res.render('alert', {content: 'Database was errored'});
    else {
      res.render('controlAEdit', {name: req.user.fullname, data: docs});
    }
  });
});
//da tam tam
router.get("/:id", ensureAuth, (req, res)=>{
  // var id= req.params.id;
  // console.log(id);
  // room.findById(id, (err, doc)=>{
  //   if (err) res.render('alert', {content: 'Database was errored'});
  //   else{
  //     console.log(doc);
  //     res.json(doc);
  //   }
  // })
  res.render('home');
})
