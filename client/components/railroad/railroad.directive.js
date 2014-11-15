(function() {
  'use strict';

  angular
    .module('baseApp')
    .directive('railroad', ['handlerHelpers', 'modifyTree', railroad]);

  function railroad(handlerHelpers, modifyTree) {

    return {
      restrict: "E",
      replace: true,
      template: '<div></div>',
      link: function(scope, element, attrs) {

        var item, itemID, location;

        // makes railroad diagram and appends to DOM
        scope.$watch('main.regexp', function(newVal, oldVal, scope){
          scope.main.regexTree = parseRegex(scope.main.regexp);
          scope.main.treeChanged++;

          // this below is just for testing purposes.
          window.regexpTree = scope.main.regexTree;
        });

        //
        scope.$watch('main.treeChanged', function(newVal, oldVal, scope){
          var newRR = scope.rr.createRailroad(scope.main.regexTree);
          element.empty();
          element.append( '<div>'+ newRR+'</div>');
        });

        // set selected item
        element.on('mousedown',function(event){
          item = $(event.toElement).closest('.literal-sequence, .capture-group, .charset')
          itemID = item.attr('id');
          // create clone and append to DOM
          var copy = $(item).clone()
            .attr('fill', 'black')
            .wrap('<svg class="copy" style="position: absolute; top:20"></svg>')
            .parent();

          $(copy).css({
            top: 10,
            left: 10
          })
          console.log($(copy).offset().top)


          $('.testing').empty();
          $('.testing').append(copy);

          // gray out the selected item
          $(item).attr('class', 'ghost');
        })

        element.on('mouseup', function(event) {
          if (handlerHelpers.checkLocation(event) != 'svg') {
            modifyTree.removeNode(itemID, scope.main.regexTree);
          }
        });
      }
    }
  }
})();
