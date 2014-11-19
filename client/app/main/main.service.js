(function() {
  'use strict';

  angular.module('ValuesModule', [])
    .factory('values', values);


    function values(){
      // initialize all values to equivalient empties, so $watch doesnt freak out.
      var string = '',
          regexBody = '',
          regexTags = '',
          matches,
          regexp = '',
          regexTree = {"type": "match", "body": []},
          treeChanged = 0,
          info = 'Drag and drop elements from the library below to build a regex diagram';

      return {
        string: string,
        regexBody: regexBody,
        regexTags: regexTags,
        regexp: regexp,
        regexTree: regexTree,
        matches: matches,
        treeChanged: treeChanged,
        info: info
      };
    }

})();
