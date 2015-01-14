(function() {
  'use strict';

  angular.module('matchesFactory', [])
    .factory('matchHelpers', matchHelpers);

    function matchHelpers() {

      function getMatchHTML(string, regex) {

        regex = regex || /.+/;

        var match,
            indexes,
            added = 0,
            matches = {};

        // The nature of .exec() requires that a while loop not be used unless the global tag is present
        if (regex.global) {
          while (match = regex.exec(string)) {
            matches[match.index] = match[0];
          }
        } else {
           if (match = regex.exec(string)) {
             matches[match.index] = match[0];
           }
        };
        // indexes must be sorted in ascending order
        indexes = Object.keys(matches).sort(function(a,b){ return a-b });

        // loop through indexes and wrap matches in span tags
        string = string.split('');

        for (var i = 0; i < indexes.length; i++ ) {
          string.splice(parseInt(indexes[i])+added, 0, '<span class="hilight">') + string;
          string.splice(parseInt(indexes[i])+matches[indexes[i]].length+added+1, 0, '</span>') + string;
          added += 2;
        }
        return string.join('');
      }

      // Sets caret to the end of the contenteditable div
      function setCaret() {
          var el = $('#matches')[0];
          var range = document.createRange();
          var selectedEl = window.getSelection();
          range.setStart(el, el.childNodes.length);
          range.collapse(true);
          selectedEl.removeAllRanges();
          selectedEl.addRange(range);
          el.focus();
      }

      return {
        getMatchHTML: getMatchHTML,
        setCaret: setCaret
      };
    }

})();