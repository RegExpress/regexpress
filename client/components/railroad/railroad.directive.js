(function() {
  'use strict';

  angular
    .module('baseApp')
    .directive('railroad', ['handlerHelpers', 'modifyTree', railroad]);

  function railroad(handlerHelpers, modifyTree) {

    return {
      restrict: "E",
      replace: true,
      template: '<div class="RR-dir"></div>',
      link: function(scope, element, attrs) {
        console.log(element.attr('class'))

        var item, itemID, location, oldClass;

        // makes railroad diagram and appends to DOM
        scope.$watch('main.regexp', function(newVal, oldVal, scope){
          scope.main.regexTree = parseRegex(scope.main.regexp);
          scope.main.treeChanged++;

          // this below is just for testing purposes.
          window.regexpTree = scope.main.regexTree;
        });

        // watches tree counter, which is tripped everytime the tree is DONE changing.
        // Creates and appends new Railroad diagram
        scope.$watch('main.treeChanged', function(newVal, oldVal, scope){
          console.log("treeCounter changes", scope.main.treeChanged);
          var newRR = scope.rr.createRailroad(scope.main.regexTree);
          element.empty();
          element.append( '<div>'+ newRR+'</div>');
        });

        // set selected item and itemID
        element.on('mousedown',function(event){
          item = $(event.toElement).closest('.literal-sequence, .capture-group, .charset')
          itemID = item.attr('id');

          console.log(event)
          console.log(event.pageY)

          // create clone and append to DOM
          var copy = $(item).clone()
            .attr('fill', 'black')
            .wrap('<svg class="copy" style="position: absolute;"></svg>')
            .parent();

          $(copy).css({
            top: event.pageY,
            left: event.pageX
          })

          $('body').append(copy);

          // gray out the selected item
          oldClass = $(item).attr('class');
          $(item).attr('class','ghost '+ oldClass);
          $('g.ghost rect').css('stroke', 'gray');
        })

        // removed item from tree on mouseup if off the RR
        element.on('mouseup', function(event) {
          if (handlerHelpers.checkLocation(event) != 'svg') {
            console.log('calling remove', itemID)
            var intID = parseInt(itemID)
            modifyTree.removeNode(intID, scope.main.regexTree);
            scope.$apply(function(){
              scope.main.treeChanged++;
            });
          } else {
            // un-gray the dropped item
            $('g.ghost rect').css('stroke', 'black');
            $(item).attr('class', oldClass);
          }
        });
      }
    }
  }
})();
