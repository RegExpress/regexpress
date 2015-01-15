(function() {
  'use strict';

  angular
    .module('baseApp')
    .directive('trackMatches', [ 'matchHelpers', trackMatches]);

  function trackMatches(matchHelpers) {

    return {
      restrict: "E",
      template: '<div id="matches" contenteditable>Write text here!</div>',
      link: function(scope, element, attrs) {

        scope.$watch('main.regexp', function(newVal, oldVal, scope){
          // really janky fix
          setTimeout(getAllMatches,5);
        });

        // on keypress, obliterate and recreate the span structure inside of the content editable string. too slow? WE'LL FIND OUT.
        $(element).on('keypress', function(){
          getAllMatches();
          // set the caret to the end of the line
          matchHelpers.setCaret();
        })

        var getAllMatches = function(){
           // Find text in content editable div
          var text = $(element.children()[0]).text();
          // Throw matched elements into hilighted spans TODO take out hardwired regex
          var matchHTML = matchHelpers.getMatchHTML(text, scope.main.regexp);
          // set the HTML of the content editable div
          $(element.children()[0]).html(matchHTML);
        }

      }
    }
  }
})();