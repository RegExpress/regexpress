(function() {
  'use strict';

  angular.module('clickHelpers', [])
    .factory('handlerHelpers', handlerHelpers);

    function handlerHelpers(){
      // maybe move these to their own factory, or change the name of this one
      /// INFORMATIVE MESSAGE TEXT:
      var building = 'Drag and drop elements from the library below to the railroad and build a regex diagram';
      var editingText = 'Press enter when done editing, or click elsewhere on the page to cancel';
      var draggingItme = 'Drag the item off the diagram to remove it, or place it elsewhere on the railroad';
      // add more as you see fit

      /*
      * Hides the copy that is the current target of the event and checks the class of the element underneath. This can check
      * whether the mouse is over the railroad diagram or not.
      */

      function checkUnderCopy(event){
        var over = {};
        $('.copy').hide();
        var elem = document.elementFromPoint(event.pageX, event.pageY);
        $('.copy').show();
        over.elem = elem;
        over.class = $(elem).attr('class');
        over.id = $(elem).attr('id');
        return over;
      }

      /*
      * Finds and returns the ID of the left railroad component sibling. If none, returns undefined
      * event: mouseup event
      */
      function findLeftSibling(event){
        var target = event.toElement; // the element that we dropped the new node onto
        var parent = $(target).parent(); // the parent of the target element
        var leftSib = $(target).prevAll('g')[0]; // the immediate sibling g element before our target element

        // if there is no immediate sibling, we're either at the beginning of the match, or inside a literal-sequence
        if(leftSib === undefined){
          if(parent.attr('class') === 'literal-sequence'){
            leftSib = $(parent).prevAll('g')[0];
          } else {
            return undefined;
          }
        }

        return parseInt($(leftSib).attr('id')); // return the integer ID, not the string
      }

      function isOverSelf(event, itemID) {
        var targetID = $(checkUnderCopy(event).elem).closest('g').attr('id');
        return targetID === itemID ? true : false;
      }

      return {
        checkUnderCopy: checkUnderCopy,
        findLeftSibling: findLeftSibling,
        building: building,
        editingText: editingText,
        isOverSelf: isOverSelf
      }
    }

})();