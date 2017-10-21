var mongoose= require('mongoose');

var roomSch= mongoose.Schema({
  userId: Object,
  name: String,
  output1: String,
  valout1: {
    type: Number,
    default: 0
  },
  output2: {
    type: String,
    default: "Equip 1"
  },
  valout2: {
    type: Number,
    default: 0
  },
  output3: {
    type: String,
    default: "Equip 2"
  },
  valout3: {
    type: Number,
    default: 0
  },
  input1: {
    type: String,
    default: "Equip 3"
  },
  valin1: {
    type: Number,
    default: 0
  },
  input2:{
    type: String,
    default: "Equip 4"
  },
  valin2: {
    type: Number,
    default: 0
  },
});

var room= module.exports= mongoose.model('room', roomSch);

module.exports.setup= function(newroom, callback){
  newroom.save(callback);
}

module.exports.findByIdUser= function(userId, callback) {
  room.find({userId: userId}, callback);
}

// module.exports.updateChange= function(data, callback){
//   var set;
//   if (data.equip == 1) {
//     set= {
//       output1: data.value;
//     }
//   } else {
//     if (data.equip == 2) {
//       set= {
//         output2: data.value;
//       }
//     } else {
//       set= {
//         output3: data.value;
//       }
//     }
//   }
//   room.update(
//     {_id: id},
//     {$set: set},
//     (err, doc)=>{
//       if (err) {};
//       else{
//         ;
//       }
//     }
//   );
// }
