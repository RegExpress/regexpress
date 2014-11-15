(function() {
  'use strict';

  angular
    .module('baseApp')
    .directive('railroad', ['handlerHelpers', railroad]);

  function railroad(handlerHelpers) {

    return {
      restrict: "E",
      replace: true,
      template: '<div></div>',
      link: function(scope, element, attrs) {

        var item, location;

        // makes railroad diagram and appends to DOM
        scope.$watch('main.regexp', function(newVal, oldVal, scope){
          console.log("parsing regex");
          scope.main.regexTree = parseRegex(scope.main.regexp);
          // this below is just for testing purposes.
          window.regexpTree = scope.main.regexTree;
          var newRR = scope.rr.createRailroad(scope.main.regexTree);
          element.empty();
          element.append( '<div>'+ newRR+'</div>');
        });

        // set selected item
        element.on('mousedown',function(event){ item = $(event.toElement).closest('.match').attr('id');})

        element.on('mouseup', function(event) {
          if (handlerHelpers.checkLocation(event) != 'svg') {
            console.log('remove ', item);
            // trigger removal
          }
        });

      }
    }
  }
})();
