(function() {
  'use strict';

  angular
    .module('baseApp')
    .directive('placeWorkspace', placeWorkspace);


  function placeWorkspace() {
    return {
      restrict: "E",
      replace: false,
      templateUrl: 'components/workspace/workspace.template.html',
      link: function(scope, element, attrs) {

        $('.library').on('mousedown', function(){
          scope.main.nodeToAdd = {'type': 'start'};
        })

        $('.library').on('mouseup', function(){
          scope.main.nodeToAdd = undefined;
        })

      }
    }
  }
})();