(function() {
  'use strict';

  angular
    .module('baseApp')
    .directive('trackMatches', trackMatches);

  function trackMatches() {

    return {
      restrict: "E",
      template: '<div>matches</div>',
      link: function(scope, element, attrs) {
        // watches for changes in regex, creates matched string and appends to DOM
        scope.$watch('main.regexp', function(newVal, oldVal){
          try {
            scope.main.matches = scope.main.string.match(scope.main.regexp);
            var stuff = scope.main.string.match(scope.main.regexp);
            element.empty();
            element.append('<p>' + scope.main.matches + '</p>');
            console.log(stuff)
            //
            // $scope.highlight = function(text, search) {
            //   if (!search) {
            //     return text;
            //   }
            //   console.log("this is being called")
            //   return text.replace(new RegExp(search, 'gi'), '<span class="highlightedText">$&</span>');
            // };
            // $scope.highlight(scope.main.string, scope.main.matches);
          } catch (err) {
            // triggered when there are no matches
            // console.log(err)
          }



        });
      }
    }
  }
})();
