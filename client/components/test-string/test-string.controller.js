(function() {
  'use strict';

  angular
    .module('baseApp')
    .controller('TestString', TestString);


  function TestString($scope) {
    $scope.string = { 'str':'\"some words here that are going to be regexe\'d so hard\"'};
  }
})();