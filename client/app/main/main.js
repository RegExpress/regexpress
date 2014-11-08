(function() {
  'use strict';

  angular
    .module('baseApp', ['makeRailroad'])
    .controller('MainController', MainController);

    function MainController($scope) {
      $scope.string = 'Here are some words. Hooray 123456 !.';
      $scope.regexBody = '';
      $scope.regexTags = '';
      $scope.match = '';
    }

})();