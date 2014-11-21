(function() {
  'use strict';

  angular.module('clickHelpers', [])
    .factory('handlerHelpers', handlerHelpers);

    function handlerHelpers(){
      // maybe move these to their own factory, or change the name of this one
      /// INFORMATIVE MESSAGE TEXT:
      var building = 'Drag and drop elements from the library below to the railroad and build a regex diagram';
      var editingText = 'Press enter when done editing, or click elsewhere on the page to cancel';
      // add more as you see fit

      function checkUnder(event){
        $('.copy').hide();
        var elem = document.elementFromPoint(event.pageX, event.pageY);
        $('.copy').show();
        return $(elem).attr('class');
      }

      function findLeftSibling(event){
        // if the path is from a literal node, go up one more parent layer to detect siblings.
        var target = event.toElement;
        if ($(target).parent('.literal-sequence')[0] != undefined) {
          target = $(target).parent();
        }
        var leftSib = $(target).prevAll('g')[0];
        return leftSib === undefined ? undefined : parseInt($(leftSib).attr('id'));
      }

      return {
        checkUnder: checkUnder,
        findLeftSibling: findLeftSibling,
        building: building,
        editingText: editingText
      }
    }

})();