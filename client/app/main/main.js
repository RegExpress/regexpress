(function() {
  'use strict';

  angular
    .module('baseApp',[
      'ValuesModule',
      'makeRRModule',
      'clickHelpers',
      'modifyTreeModule',
    ])
    .controller('MainController', [ '$scope','values', 'makeRR', 'modifyTree', MainController ]);

    function MainController($scope, values, makeRR, modifyTree) {
      $scope.main = values;
      $scope.rr = makeRR;

      // for testing purposes
      $scope.callAdd = function() {
        var bigObject = {"sib": null,"parent": 8,"node": {"type": "literal", "body": "s"}};
        // bigObject = JSON.parse(bigObject);
        modifyTree.addNode(bigObject.sib, bigObject.parent, bigObject.node, $scope.main.regexTree);
        $scope.main.treeChanged++;
      };

      // console.log($scope.main.regexTree);
      // $scope.callRemove = function(targetId) {
      //   var toRemoveInt = parseInt(targetId);
      //   console.log('now removing', targetId)
      //   modifyTree.removeNode(toRemoveInt, $scope.main.regexTree);
      //   $scope.main.treeChanged++;
      // };
    }

})();
