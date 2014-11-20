(function() {
  'use strict';

  angular.module('clickHelpers', [])
    .factory('handlerHelpers', handlerHelpers);

    function handlerHelpers(){
      // maybe move these to their own factory, or change the name of this one
      /// INFORMATIVE MESSAGE TEXT:
      var building = 'Drag and drop elements from the library below to the railroad and build a regex diagram';
      var editingText = 'Press enter when done editing';
      // add more as you see fit

      function checkUnder(event){
        $('.copy').hide();
        var elem = document.elementFromPoint(event.pageX, event.pageY);
        $('.copy').show();
        return $(elem).attr('class');
      }

      function findLeftSibling(event){

        // not actually the target node.. need to traverse differently.
        var targetID = $(event.toElement).closest('g').attr('id');

        var sib = $(event.toElement).prevAll('g');
        // select the first sibling returned. and figure out how to fix the trailing path problem
        console.log('prev', sib);
      }


      return {
        checkUnder: checkUnder,
        building: building,
        editingText: editingText,
        findLeftSibling: findLeftSibling
      }
    }

})();