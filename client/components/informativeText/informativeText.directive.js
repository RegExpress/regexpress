(function() {
  'use strict';

  angular
    .module('baseApp')
    .directive('informativeText', informativeText);

  // watches changing user regex input and changes scope variable regexp to reflect this
  function informativeText() {

    return {
      restrict: "E",
      template: '<div class="informativeText">info directive</div>',
      link: function(scope, element, attrs) {
        scope.$watch('main.info', function(){
          element.empty();
          // element.append('<p>' + scope.main.info + '</p>');
        })

      }
    };
  }

})();