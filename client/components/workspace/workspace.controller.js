(function() {
  'use strict';

  angular
    .module('regexApp', [])
    .controller('workspace', Workspace);


  function workspace($scope) {
    $scope.workspace = { 'space':"This is the workspace. have some big fat divs and shit");
  }
})();