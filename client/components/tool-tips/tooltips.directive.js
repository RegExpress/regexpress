(function() {
  'use strict';

  angular
    .module('baseApp')
    .directive('toolTip', ['tooltipsFactory', toolTip]);

  // This directive controls the appearance of tooltips on the DOM
  function toolTip(tooltipsFactory) {

    return {
      restrict: "E",
      template: '<span class="question">?</span>',
      link: function(scope, element, attrs) {
        $(element).hover(function(){
          // The class of the tooltip element will determine what text is appended
          var type = $(this).attr('class');
          // Finds the inner span class and appends the tooltip html
          $($(this)[0].children[0]).append(tooltipsFactory.tooltipTable[type]);
        }, function(){
          // Removes the tooltip once hover is ended
          $("div.tooltip").remove();
        })

      }
    };
  }

})();