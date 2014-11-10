(function() {
  'use strict';

  angular
    .module('baseApp', [
      'makeRailroad'
     ])

    .controller('MainController', [ '$scope', 'createRailroad','$sce', MainController ]);

    function MainController($scope, createRailroad, $sce) {
      $scope.string = '';
      $scope.regexBody = '';
      $scope.regexTags = '';
      $scope.regex = /(?:)/;
      $scope.match = '';
      $scope.railroad = '';

      // updates regex object from input strings, only updates if the regex is valid
      $scope.$watchGroup(['regexBody', 'regexTags'], function(newVal, oldVal, scope){
        try {
          scope.regex = new RegExp(newVal[0]);
        } catch (err) {
          //nobody cares about this error
        }
      })

      // triggered when user types in regex
      $scope.submitRegex = function(){

        // takes in user's regex and sets $scope.railroad to the railroad diagram for that regex
        var newRR = createRailroad.RR($scope.regex);
        $scope.railroad = $sce.trustAsHtml(newRR.toString());

        // update match string through test-string directive TODO


      }

    };

})();