// var Promise = require('bluebird');
var mongoose = require('mongoose');

var photoSchema = mongoose.Schema({
  name: String
});

var Photo = mongoose.model('photo', photoSchema);



//below sets up connect, checks for existence of connection first
var _conn;

function connect(){
  if(_conn)
    return _conn;
  _conn = new Promise(function(resolve, reject){
    mongoose.connect(process.env.MONGOLAB_URI || process.env.CONN, function(err){
      if(err)
        return reject('make sure mongo is running on this machine');
      resolve(mongoose.connection);
    });
  });
  return _conn;
}

function disconnect(){
  return new Promise(function(resolve, reject){
    mongoose.disconnect(function(){
      _conn = null;
      resolve();
    });
  });
}




module.exports = {
  connect: connect,
  disconnect: disconnect,
  Photo: Photo
};
