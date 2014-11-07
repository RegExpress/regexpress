(function() {
  'use strict';

  angular
    .module('baseApp')
    .controller('Workspace', Workspace);


  function Workspace($scope) {
    $scope.workspace = { 'space':"This is the workspace. have some big fat divs and shit"};
  }
})();