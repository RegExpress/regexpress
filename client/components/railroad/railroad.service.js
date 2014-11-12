(function() {
  'use strict';

  angular.module('makeRRModule', [])
    .factory('makeRR', makeRR);

    function makeRR(){

      // takes regex, returns railroad html snippet
      function createRailroad(regex){
        var snippet = Regex2RailRoadDiagramCopy(regex);
        return '<div class="RR">'+ snippet + '</dvi>';
      }

      return {
        createRailroad: createRailroad,
      }
    }

})();