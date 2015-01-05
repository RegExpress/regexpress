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
          savedRegexTrees = [],
          treeChanged = 0,
          info = 'Drag and items from the library below onto the line to the right, and release it when it\'s highlighted to create a regex',
          nodeToAdd;


      return {
        string: string,
        regexBody: regexBody,
        regexTags: regexTags,
        regexp: regexp,
        regexTree: regexTree,
        savedRegexTrees: savedRegexTrees,
        matches: matches,
        treeChanged: treeChanged,
        info: info,
        nodeToAdd: nodeToAdd
      };
    }

})();
