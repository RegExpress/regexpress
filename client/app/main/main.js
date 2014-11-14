(function() {
  'use strict';

  angular
    .module('baseApp', ['ValuesModule', 'makeRRModule', 'ngMaterial'])

    .controller('MainController', [ '$scope','values', 'makeRR', MainController ]);

    function MainController($scope, values, makeRR) {
      $scope.main = values;
      $scope.rr = makeRR;
    };

})();
