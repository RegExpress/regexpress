(function() {
  'use strict';

  angular
    .module('baseApp')
    .directive('placeWorkspace', ['workspace', placeWorkspace]);


  function placeWorkspace(workspace) {
    return {
      restrict: "E",
      replace: false,
      templateUrl: 'components/workspace/workspace.template.html',
      link: function(scope, element, attrs) {

        function lookUpNodeType(nodeClass){
          return workspace.getComponentNode(nodeClass);
        }

        $('.library').on('mousedown', function(event){
          var nodeToAddType = $(event.toElement).attr('id'); // node type is contained in ID of library components
          var node = lookUpNodeType(nodeToAddType);
          console.log('node to add', node);
          scope.main.nodeToAdd = node;
        })

        $('.library').on('mouseup', function(){
          scope.main.nodeToAdd = undefined;
        })

      }
    }
  }
})();