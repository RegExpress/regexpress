(function() {
  'use strict';

  angular.module('tooltipsModule', [])
    .factory('tooltipsFactory', tooltipsFactory);

    function tooltipsFactory(){
      var infoTable = {
        'question-about': '<div class="tooltip"><p>Regexpress shows the user both the text and the visual diagram for any regular expression.' +
      'Hidden behind the scenes is a syntax tree that gets updated anytime the user changes the text in the input box, or ' +
      'drags a component onto or off of the visual diagram. Changes to the syntax tree flow back to both the text and the visual ' +
      'diagram, so that all three representations of the regular expression are always in sync</p></div>',
        'question-regexinput': '<div class="tooltip"><p>Enter your regex here. When components are dragged on to or off of the visual diagram ' +
      'this text will update with the new regex!</p></div>',
        'question-regextest': '<div class="tooltip"><p>Enter your test strings here. Patterns in this text that matches the regular expression ' +
      'will be highlighted</p></div>',
        'question-library': '<div class="tooltip"><p>This is a library of regex components. Drag and drop items from this libary onto the ' +
      'workspace</p></div>',
        'question-railroad': '<div class="tooltip"><p>This is the railroad! Your regular expressions entered above will be displayed here. ' +
      'Additionally, you can drag and drop components from the library below onto this workspace, as well as move components along '+
      'the railroad or remove them</p></div>'
      };

      var componentTable = {
        'default': 'Hover over a component to see what it does',
        'text': '',
        'capture-group': '',
        'start': '',
        'end': '',
        'digit': '',
        'word': '',
        'word-boundary': '',
        'white-space': '',
        'any-character': '',
        'non-digit': '',
        'non-word': '',
        'non-word-boundary': '',
        'non-white-space': '',
        'optional': '',
        'repeating': '',
        'alternate': '',
        'alternate-solo': ''
      };

      // For the sake of readability and organization, the info blocks and component tool tips are stored in separate objects. Extend is used to  combine the two into one object for easy lookup.
      var tooltipTable = angular.extend(infoTable, componentTable);

      return {
        tooltipTable: tooltipTable
      };
    }
})();