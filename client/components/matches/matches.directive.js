(function() {
  'use strict';

  angular
    .module('baseApp')
    .directive('trackMatches', [ 'matchHelpers', trackMatches]);

  function trackMatches(matchHelpers) {

    return {
      restrict: "E",
      template: '<div id="matches" contenteditable></div>',
      link: function(scope, element, attrs) {

        // on keypress, obliterate and recreate the span structure inside of the content editable string. too slow? WE'LL FIND OUT.
        $(element).on('keypress', function(){
          var text = $(element.children()[0]).text();
          var matchHTML = matchHelpers.getMatchHTML(text, /\d+/g);

          $(element.children()[0]).html(matchHTML);

          matchHelpers.setCaret();

        })

      }
    }
  }
})();