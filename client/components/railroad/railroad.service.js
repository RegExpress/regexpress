(function() {
  'use strict';

  angular.module('makeRRModule', [])
    .factory('makeRR', makeRR);

    function makeRR(){

      // takes regex tree, returns railroad html snippet
      function createRailroad(regexTree){
        var snippet = Regex2RailRoadDiagramCopy(regexTree);
        return '<div class="RR">'+ snippet + '</dvi>';
      }

      // // maybe move these to their own factory, or change the name of this one
      // /// INFORMATIVE MESSAGE TEXT:
      // var building = 'Drag and drop elements from the library below to build a regex diagram';
      // var editingText = 'Press ented when done editing';
      // // add more as you see fit

      return {
        createRailroad: createRailroad
      };
    }

})();
