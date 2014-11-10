(function() {
  'use strict';

  angular
    .module('baseApp', ['makeRailroad'])
    .controller('MainController', MainController);

    function MainController($scope, createRailroad) {
      $scope.string = 'Here are some words. Hooray 123456 !.';
      $scope.regexBody = '[@].+';
      $scope.regexTags = '';
      $scope.match = '';
      $scope.railroad = '<span>crap</span>';

      $scope.fuckshitup = function(makeRailroad){
        console.log('running fuck shit up')
        $scope.railroad = createRailroad.RR($scope.regexBody, $scope.regexTags);
      }

      $scope.checkShit = function(){
        console.log('checkShit says that rr is', $scope.railroad);
      }

    }

})();