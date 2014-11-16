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
      // $scope.callRemove = function(targetId) {
      //   var toRemoveInt = parseInt(targetId);
      //   console.log('now removing', targetId)
      //   modifyTree.removeNode(toRemoveInt, $scope.main.regexTree);
      //   $scope.main.treeChanged++;
      // };
    }

})();
