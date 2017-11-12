var room= require('../route/room.js');

exports= module.exports = function(io){
  io.sockets.on('connection', (socket)=>{
    console.log("New");
    socket.on('webChange', (data)=>{
			room.updateChange(data, (err, doc)=>{
				if (err) {
          throw err ;
          console.log("err");
        }
			});
      console.log(data);
      io.emit('equipLoad',data);
    });
    socket.on('equipChange', function(data) {
      console.log(data.id);
      console.log(data.equip);
      console.log(data.value);
      io.emit('webLoad', data)
    });
  });
}
