(function() {
  'use strict';

  angular
    .module('regexApp', [])
    .controller('testString', testString);


  function testString($scope) {
    $scope.string = { 'str':'some words here that are going to be regexe\'d so hard');
  }
})();