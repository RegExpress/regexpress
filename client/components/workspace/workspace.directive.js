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
          scope.main.nodeToAdd = node;
        })

        $('.library').on('mouseup', function(){
          scope.main.nodeToAdd = undefined;
        })

        $(element).on('mousedown', function(event){
          var clone = $(event.target).clone()
            .attr('class', 'drag components')
            .css({
              position: 'absolute',
              top: event.pageY+5,
              left: event.pageX+5
            });

          $('.library-container').append(clone);
        })

        $('body').on('mousemove', function(){
          $('.drag').css({
              top: event.pageY+5,
              left: event.pageX+5
            })
        })

        $('body').on('mouseup', function(){
          $('.drag').remove();
        })

      }
    }
  }
})();
