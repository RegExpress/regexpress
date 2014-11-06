(function() {
  'use strict';

  angular
    .module('regexApp', [])
    .controller('Railroad', Railroad);


  function Railroad($scope) {
    $scope.railroad = { 'road':"put railroad here, obvi");
  }
})();