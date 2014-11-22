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

    function MainController($scope, values, makeRR, modifyTree, workspace) {
      $scope.main = values;
            
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
