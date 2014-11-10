(function() {
  'use strict';

  angular
    .module('baseApp', [
      'makeRailroad'
     ])

    .controller('MainController', [ '$scope', 'createRailroad','$sce', MainController ]);

    function MainController($scope, createRailroad, $sce) {
      $scope.string = 'Here are some words. Hooray 123456!.';
      $scope.regexBody = '';
      $scope.regexTags = '';
      $scope.match = '';
      $scope.railroad = '';

      // triggered when user clicks submit button
      $scope.submitRegex = function(){

        // takes in user's regex and sets $scope.railroad to the railroad diagram for that regex
        var newRR = createRailroad.RR($scope.regexBody, $scope.regexTags);
        $scope.railroad = $sce.trustAsHtml(newRR.toString());

        // update match string through test-string directive TODO

        // display railroad diagram through railroad directive
        //$scope.displayRailroad();

      }

    };

})();