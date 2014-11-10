(function() {
  'use strict';

  angular
    .module('baseApp', ['makeRailroad'])
    .controller('MainController', MainController);

    function MainController($scope, createRailroad) {
      $scope.string = 'Here are some words. Hooray 123456!.';
      $scope.regexBody = '';
      $scope.regexTags = '';
      $scope.match = '';
      $scope.railroad = '<span>crap</span>';

      // triggered when user clicks submit button
      $scope.submitRegex = function(){

        // takes in user's regex and sets $scope.railroad to the railroad diagram for that regex
        $scope.railroad = createRailroad.RR($scope.regexBody, $scope.regexTags);

        // update match string through test-string directive TODO

        // display railroad diagram through railroad directive
        $scope.displayRailroad();

      }

    }

})();