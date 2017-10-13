var express= require('express'),
    router= express.Router(),
    room= require('./room.js');
module.exports = router;
router.get("/", ensureAuth, function(req,res) {
  room.findByIdUser(req.user.id, (err, docs)=>{
    if (err) res.render('alert', {content: 'Database wasn\' errored'});
    else{
      res.render('control', {name: req.user.fullname, data: docs});
    }
  })
  // res.render('control', {name: req.user.fullname});
});
function ensureAuth(req,res,next) {
  if(req.isAuthenticated()) return next();
  res.redirect('login');
}
