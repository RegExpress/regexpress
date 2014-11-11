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
      $scope.regex = /./;
      $scope.matches = '';
      $scope.railroad = '';

      // updates regex object from input strings, only updates if the regex is valid
      $scope.$watchGroup(['regexBody', 'regexTags'], function(newVal, oldVal, scope){
        $scope.updateRegex(newVal, oldVal);
        $scope.updateMatch();
      })

      $scope.$watch('string', function(newVal, oldVal){
        $scope.updateMatch();
      })

      // handles updates ( move to factory )
      $scope.updateMatch = function(){
        try {
          var tryMatch = $scope.string.match($scope.regex);
          $scope.matches = tryMatch[0];
        } catch (err) {
          $scope.matches = '';
        }
      }

      $scope.updateRegex = function(newVal, oldVal){
        try {
          $scope.regex = new RegExp(newVal[0], newVal[1]);
        } catch (err) {
          //nobody cares about this error
        }
      }

      // triggered when user types in regex
      $scope.submitRegex = function(){

        // takes in user's regex and sets $scope.railroad to the railroad diagram for that regex
        var newRR = createRailroad.RR($scope.regex);
        $scope.railroad = $sce.trustAsHtml(newRR.toString());

        // update match string through test-string directive TODO

      }

    };

})();