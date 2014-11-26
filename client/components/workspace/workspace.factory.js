(function() {
  'use strict';

  angular.module('workspaceModule', [])
    .factory('workspace', workspace);

    function workspace(){

      //holder text for elements that will look weird with nothing inside. says "<text here>"
      var text = '{"type": "match", "body": [{"type": "literal", "body": "<"}, {"type": "literal", "body": "t"}, {"type": "literal", "body": "e"},{"type": "literal", "body": "x"},{"type": "literal", "body": "t"},{"type": "literal", "body": " "},{"type": "literal", "body": "h"},{"type": "literal", "body": "e"},{"type": "literal", "body": "r"},{"type": "literal", "body": "e"},{"type": "literal", "body": ">"}]}';


      /*
      * Table of strings for each individual type of component. Need to keep a table of strings and parse them each time so that a new object
      * is returned on each call instead of the same object.
      */

      var componentTable = {
        'start': '{"type": "start"}',
        'end': '{"type": "end"}',
        'any-character': '{"type": "any-character"}',
        'word': '{"type": "word"}',
        'non-word': '{"type": "non-word"}',
        'digit': '{"type": "digit"}',
        'non-digit': '{"type": "non-digit"}',
        'white-space': '{"type": "white-space"}',
        'non-white-space': '{"type": "non-white-space"}',
        'word-boundary': '{"type": "word-boundary"}',
        'non-word-boundary': '{"type": "non-word-boundary"}',
        'text': text,
        'capture-group': '{"type": "capture-group", "body":' + text + '}',
        'alternate': '{"type": "capture-group", "body": {"type": "alternate", "left":' + text + ', "right":' + text + '}}',
        'optional': '{"type": "quantified", "body": {"type": "capture-group", "body":' + text + '}, "quantifier": {"min": 0, "max": 1}}',
        'repeating': '{"type": "quantified", "body": {"type": "capture-group", "body":' + text + '}, "quantifier": {"min": 1, "max": null}}'
      };

      /*
      * Returns the appropriate node for the given type
      * type: the type of node to return from the table
      */
      function getComponentNode(type){
        return JSON.parse(componentTable[type]);
      }

    	return {
        getComponentNode: getComponentNode
    	};
    }
})();