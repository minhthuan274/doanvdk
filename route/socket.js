var room= require('../route/room.js');

module.exports = function(io){
  io.on('connection', function (socket) {
    console.log("New");
    socket.on('webChange', function(data) {
      console.log(data);
      io.emit('equipLoad',data);
    });
    socket.on('EquipChange', function(data) {
      console.log(data);
      io.emit('webLoad', data);
    })
  });
}
