(function() {
  'use strict';

  angular
    .module('baseApp',[
      'ValuesModule',
      'clickHelpers',
      'modifyTreeModule',
      'makeRRModule',
      'workspaceModule',
      'tooltipsModule',
      'matchesFactory'
    ])
    .controller('MainController', [ '$scope','values', 'modifyTree', 'workspace', 'makeRR', MainController ]);

    function MainController($scope, values, modifyTree, workspace, makeRR) {
      $scope.main = values;
    }

})();
