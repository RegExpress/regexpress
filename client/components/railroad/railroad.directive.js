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
          // // create clone and append to DOM
          // var copy = $(item).clone()
          //   .attr('fill', 'black')
          //   .wrap('<svg class="copy" style="position: absolute; top:20"></svg>')
          //   .parent();

          // $(copy).css({
          //   top: 10,
          //   left: 10
          // })
          // console.log($(copy).offset().top)


          // $('.testing').empty();
          // $('.testing').append(copy);

          // // gray out the selected item
          // $(item).attr('class', 'ghost');
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
          }
        });
      }
    }
  }
})();
