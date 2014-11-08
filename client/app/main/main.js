(function() {
  'use strict';

  angular
    .module('baseApp', ['makeRailroad'])
    .controller('MainController', MainController);

    function MainController($scope) {
      $scope.string = '\"some words here that are going to be regexe\'d so hard\"';
      $scope.regex = '/\w+/';
    }

})();