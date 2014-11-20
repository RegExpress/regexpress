(function() {
  'use strict';

  angular.module('clickHelpers', [])
    .factory('handlerHelpers', handlerHelpers);

    function handlerHelpers(){

      function checkUnder(event){
        $('.copy').hide();
        var elem = document.elementFromPoint(event.pageX, event.pageY);
        $('.copy').show();
        return $(elem).attr('class');
      }

      // maybe move these to their own factory, or change the name of this one
      /// INFORMATIVE MESSAGE TEXT:
      var building = 'Drag and drop elements from the library below to the railroad and build a regex diagram';
      var editingText = 'Press enter when done editing';
      // add more as you see fit

      return {
        checkUnder: checkUnder,
        building: building,
        editingText: editingText
      }
    }

})();