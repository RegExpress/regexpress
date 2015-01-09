(function() {
  'use strict';

  angular
    .module('baseApp')
    .directive('toolTip', ['tooltipsFactory', toolTip]);

  // This directive controls the appearance of tooltips on the DOM
  function toolTip(tooltipsFactory) {

    return {
      restrict: "E",
      template: '<div ng-transclude class="tip"></div>',
      transclude: true,
      link: function(scope, element, attrs) {
        $(element).hover(function(){
          var el, type;

          // If tool is a question button, append div element. Else, reset text on scope
          if (this.getAttribute('id') === 'question') {

            // The class of the tooltip element will determine what text is appended
            type = $(this).children()[0].children[0].classList[1];
            // Finds the inner span class and appends the tooltip html
            $($(this)[0].children[0].children[0]).append(tooltipsFactory.tooltipTable[type]);

          } else {
            type = $(this).children()[0].children[0].getAttribute('id');
            scope.$apply(function(){
              scope.main.componentTip = tooltipsFactory.tooltipTable[type][0];
              scope.main.componentSymbol = tooltipsFactory.tooltipTable[type][1];
            });

          };
        }, function(){
          // Removes the tooltip once hover is ended
          $("div.tooltip").remove();

          // is scope.$apply expensive? I could put this in an if statement
          scope.$apply(function(){
              scope.main.componentTip = tooltipsFactory.tooltipTable['default'][0];
              scope.main.componentSymbol = tooltipsFactory.tooltipTable['default'][1];
          });
        });

      }
    };
  }

})();