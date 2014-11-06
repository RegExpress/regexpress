(function() {
  'use strict';

  angular
    .module('regexApp', [])
    .controller('Regex', Regex);


  function Regex($scope) {
    $scope.regex = { 're': '/\w+/'};
  }
})();