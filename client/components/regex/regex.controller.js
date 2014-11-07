(function() {
  'use strict';

  angular
    .module('baseApp')
    .controller('Regex', Regex);


  function Regex($scope) {
    $scope.regex = { 're': '/\w+/'};
  }
})();