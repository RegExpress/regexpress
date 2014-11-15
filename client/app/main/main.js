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
      $scope.callRemove = function() {
        console.log("idtoremove", $scope.idToRemove);
        console.log($scope.main.regexTree);
        console.log("changed", $scope.main.treeChanged);
        var toRemoveInt = parseInt($scope.idToRemove);
        modifyTree.removeNode(toRemoveInt, $scope.main.regexTree);
        $scope.main.treeChanged++;
      };

    }

})();
