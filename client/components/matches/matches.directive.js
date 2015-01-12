(function() {
  'use strict';

  angular
    .module('baseApp')
    .directive('trackMatches', [ 'makeMatches', trackMatches]);

  function trackMatches(makeMatches) {

    return {
      restrict: "E",
      template: '<div class="matches" contenteditable><span class="hilight">this </span><span>is </span><span class="hilight">word </span></div>',
      link: function(scope, element, attrs) {

        // on keypress, obliterate and recreate the span structure inside of the content editable string. too slow? WE'LL FIND OUT.
        $(element).on('keypress', function(){
          var text = $(element.children()[0]).text();
          console.log(text);
          // process text and apply regex to find matches array

          // var matches = text.match(/\d+/g);


        })

      }
    }
  }
})();


// contents of track-matches directive

// // watches for changes in regex, creates matched string and appends to DOM
        // // does not work at all right now

        // scope.$watchGroup(['main.regexp', 'main.string'], function(newVal, oldVal){
        //   var $textarea = $('.test-text');

        //   scope.$emit('matched changed');
        //   try {
        //     scope.main.matches = scope.main.string.match(scope.main.regexp);
        //     element.empty();
        //     // element.append('<p>' + scope.main.matches + '</p>');
        //     var wordMatches = scope.main.matches[0].split(' ')
        //     var test = ["word", "stuff", "w"]
        //     scope.$broadcast('matched changed');
        //     // console.log(scope.main.regexp)
        //     var regex = [];
        //     regex.push('"' + scope.main.regexp + '"');
        //     // console.log(regex)
        //     // $textarea.highlightTextarea({
        //     //   color: "#96BD4F",
        //     //   words: wordMatches
        //     // })
        //     console.log(wordMatches);
        //   } catch (err) {
        //     // console.log(err)
        //   }
        // });
