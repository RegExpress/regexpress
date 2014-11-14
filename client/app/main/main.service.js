(function() {
  'use strict';

  angular.module('ValuesModule', [])
    .factory('values', values);


    function values(){

      var string, regexBody, regexTags, regexTree, matches;
      var regexp = /.+/;

      return {
        string: string,
        regexBody: regexBody,
        regexTags: regexTags,
        regexp: regexp,
        regexTree: regexTree,
        matches: matches
      };
    }

})();
