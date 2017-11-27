var mongoose= require('mongoose'),
    bcrypt= require('bcrypt-nodejs');

var schemaAuth= mongoose.Schema({
  username: String,
  password: String,
  fullname: String
});

var query= module.exports= mongoose.model('logins', schemaAuth);

module.exports.findUser= function(username, callback) {
  query.findOne({username: username}, callback);
}

module.exports.findId= function(id, callback) {
  query.findById(id, callback);
}

module.exports.register= function(newQuery, callback) {
  newQuery.password= bcrypt.hashSync(newQuery.password);
  newQuery.save(callback);
}

module.exports.confirm= function(password, hash, callback) {
  bcrypt.compare(password, hash, function(err, match) {
    callback(err, match);
  });
}
