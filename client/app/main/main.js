(function() {
  'use strict';

  angular
    .module('baseApp', ['makeRailroad'])
    .controller('MainController', MainController);

    function MainController($scope, createRailroad) {
      $scope.string = 'Here are some words. Hooray 123456 !.';
      $scope.regexBody = '';
      $scope.regexTags = '';
      $scope.match = '';
      $scope.railroad = ''

      $scope.displayRR = function(makeRailroad){
        $scope.$apply(function(){
          $scope.railroad = createRailroad.RR();
        })
      }
    }

})();