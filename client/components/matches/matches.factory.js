(function() {
  'use strict';

  angular.module('matchesFactory', [])
    .factory('makeMatches', makeMatches);

    function makeMatches() {

      function getMatchHTML(string, regex) {
        // returns a string with all matches inside span tags
        var result = string.match(regex).join();
        return result;
        // return 'abc <span class="hilight">123</span>';
      }

      return {
        getMatchHTML: getMatchHTML
      };
    }

})();