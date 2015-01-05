(function() {
  'use strict';

  angular
    .module('baseApp',[
      'ValuesModule',
      'clickHelpers',
      'modifyTreeModule',
      'makeRRModule',
      'workspaceModule'
    ])
    .controller('MainController', [ '$scope','values', 'modifyTree', 'workspace', 'makeRR', MainController ]);

    function MainController($scope, values, modifyTree, workspace, makeRR) {
      $scope.main = values;

      // for testing purposes
      $scope.callAdd = function() {
        var bigObject = {"sib": null,"parent": 8,"node": {"type": "literal", "body": "s"}};
        modifyTree.addNode(bigObject.sib, bigObject.parent, bigObject.node, $scope.main.regexTree);
        $scope.main.treeChanged++;
      };

      $scope.undoTree = function() {
        if ($scope.main.savedRegexTrees.length > 0) {
          console.log($scope.main.savedRegexTrees);
          $scope.main.regexTree = JSON.parse($scope.main.savedRegexTrees.pop());
          console.log($scope.main.savedRegexTrees);
          $scope.main.treeChanged++;
        } else {
          console.log("no tree yo");
        }
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
