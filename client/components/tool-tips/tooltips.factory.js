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
        'default': 'Hover over a diagram component for more information',
        'text': ['Any text within this node will be matched exactly', ''],
        'capture-group': ['Place other components inside a capture component to group them together. A single capture group can be referenced with a back ref in the regex string; \\1 will refer to capture group 1', '(...)'],
        'start': ['Matches the start of a line', '^'],
        'end': ['Matches the end of a line', '$'],
        'digit': ['Matches any digit', '\\d'],
        'word': ['Matches any alphanumeric word character a-z (of either case) and 0-9 , as well as the underscore character','\\w'],
        'word-boundary': ['Matches any word boundary', '\\b'],
        'white-space': ['Matches any white space character', '\\s'],
        'any-character': ['Matches any single character of any type', '.'],
        'non-digit': ['Matches any non-digit character', '\\D'],
        'non-word': ['Matches any non-word character', '\\W'],
        'non-word-boundary': ['Matches anything that is not a word boundary', '\\B'],
        'non-white-space': ['Matches any non-whitespace character', '\\S'],
        'optional': ['Any elements within this capture group will be optional', '?'],
        'repeating': ['Elements within this capture group will repeat 1 or more times. To specify more than one repeat, edit the regex string with {minRepeats, maxRepeats} ie, {1,3}', '+'],
        'alternate': ['Regex will match any of the alternate choices provided within this capture group. Drag on additional alternate solo blocks to add more choices', '||'],
        'alternate-solo': ['Drag these alternate solo blocks inside an alternate capture group to add more choices', '||'],
      };

      // For the sake of readability and organization, the info blocks and component tool tips are stored in separate objects. Extend is used to  combine the two into one object for easy lookup.
      var tooltipTable = angular.extend(infoTable, componentTable);

      return {
        tooltipTable: tooltipTable
      };
    }
})();
