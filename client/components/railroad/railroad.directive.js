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

        var item, itemID, location, oldClass, copy;

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
//AAAAAAAAAAAAAAAAAAAAAAAAAA
        // set selected item and itemID
        element.on('mousedown',function(event){
          if (event.which === 1) {
            item = $(event.toElement).closest('.literal-sequence, .capture-group, .charset');
            itemID = item.attr('id');
            console.log($(item).closest('g')); 
          }

          // if (event.which === 1) {
          //   // create clone and append to DOM
          //   copy = $(item).clone()
          //     .attr('fill', 'black')
          //     .wrap('<svg class="copy" style="position: absolute;"></svg>')
          //     .parent();

          //   $(copy).css({
          //     top: 20,
          //     left: 20
          //   })

          //   $('.work').append(copy);

          //   // gray out the selected item
          //   oldClass = $(item).attr('class');
          //   $(item).attr('class','ghost '+ oldClass);
          //   $('g.ghost rect').css('stroke', 'gray');
          // } else if (event.which === 3) {
          //   console.log($(item))
          // }
        })

        // removed item from tree on mouseup if off the RR
        $('body').on('mouseup', function(event) {
          if (handlerHelpers.checkLocation(event) != 'svg') {
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

          item = undefined;
          $(copy).remove();
        });

        // $('body').on('mousemove', function(event){
        //   if (item) {
        //     $(copy).css({
        //       top: event.pageY,
        //       left: event.pageX
        //      })
        //   }
        // })
      }
    }
  }
})();
