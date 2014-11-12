(function() {
  'use strict';

  angular
    .module('baseApp', ['ValuesModule', 'makeRRModule', 'ngMaterial'])

    .controller('MainController', [ '$scope','trackValues', 'makeRR', MainController ]);

    function MainController($scope, trackValues, makeRR) {
      $scope.main = trackValues;
      $scope.rr = makeRR;
    };

})();
