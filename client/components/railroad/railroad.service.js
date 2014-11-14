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

      return {
        createRailroad: createRailroad,
      };
    }

})();
