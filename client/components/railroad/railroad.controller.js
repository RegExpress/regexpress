(function() {
  'use strict';

  angular
    .module('baseApp')
    .controller('Railroad', Railroad);


  function Railroad($scope) {
    $scope.railroad = { 'road':"put railroad here, obvi"};
  }
})();