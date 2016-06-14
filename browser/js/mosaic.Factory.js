app.factory('mosaicFactory', function($http, $log){
  var mosaicFactory ={};

    mosaicFactory.getCount = function(){
      return $http.get('/api/photo/mosaicCount/')
      .then(function(res){
        return res.data;
      }).catch($log.error);
    };//end getAll

  return mosaicFactory;
});//end factory
