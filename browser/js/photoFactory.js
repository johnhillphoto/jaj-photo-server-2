app.factory('photoFactory', function($http){
  var photoFactory ={};

    photoFactory.getAll = function(){
      return $http.get('/api/products')
      .then(function(res){
        return res.data;
      }).catch($log.error);
    };//end getAll

  return photoFactory;
});//end factory
