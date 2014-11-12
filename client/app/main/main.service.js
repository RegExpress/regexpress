(function() {
  'use strict';

  angular.module('ValuesModule', [])
    .factory('trackValues', trackValues);


    function trackValues(){

      var string, regexBody, regexTags, matches;
      var regexp = /.+/;

      return {
        string: string,
        regexBody: regexBody,
        regexTags: regexTags,
        regexp: regexp,
        matches: matches
      }
    }

})();