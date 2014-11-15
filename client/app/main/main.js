(function() {
  'use strict';

  angular
    .module('baseApp',[
      'ValuesModule',
      'makeRRModule',
      'ngMaterial',
      'clickHelpers',
      'modifyTreeModule'
    ])
    .controller('MainController', [ '$scope','values', 'makeRR', 'modifyTree', MainController ]);

    function MainController($scope, values, makeRR, modifyTree) {
      $scope.main = values;
      $scope.rr = makeRR;
      // console.log($scope.main.regexTree);
      // console.log(modifyTree.removeNode(1, $scope.main.regexTree));

    }

})();
