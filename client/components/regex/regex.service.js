(function() {
  'use strict';

  angular.module('makeRailroad', [])
    .factory('createRailroad', createRailroad);

    function createRailroad(){
      // takes regex parts, returns railroad html snippet
      function RR(rBody, rTags){
        var re, snippet;
        // create the new regex if valid, make snippet
        try {
          re = new RegExp(rBody, rTags);
          snippet = Regex2RailRoadDiagramCopy(re);
        } catch (err) {
          // nobody gives a crap about your error
          snippet = 'invalid regex';
        }

        return '<div class="RR">'+ snippet + '</dvi>';
      }

      // makes this function accessible by the controller
      return {
        RR : RR
      }
    }

})();