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
            jQuery.fn.highlight = function(pat) {
              function innerHighlight(node, pat) {
                var skip = 0;
                if (node.nodeType == 3) {
                  var position = node.data.toUpperCase().indexOf(pat);
                  if (position >= 0) {
                    var spannode = document.createElement('span');
                    spannode.className = 'highlight';
                    var middlebit = node.splitText(position);
                    var endbit = middlebit.splitText(pat.length);
                    var middleclone = middlebit.cloneNode(true);
                    spannode.appendChild(middleclone);
                    middlebit.parentNode.replaceChild(spannode, middlebit);
                    skip = 1;
                  }
                } else if (node.nodeType == 1 && node.childNodes && !/(script|style)/i.test(node.tagName)) {
                  for (var i = 0; i < node.childNodes.length; ++i) {
                    i += innerHighlight(node.childNodes[i], pat);
                  }
                }
                return skip;
              }
              return this.length && pat && pat.length ? this.each(function() {
                innerHighlight(this, pat.toUpperCase());
              }) : this;
            };

            jQuery.fn.removeHighlight = function() {
              return this.find("span.highlight").each(function() {
                this.parentNode.firstChild.nodeName;
                with (this.parentNode) {
                  replaceChild(this.firstChild, this);
                  normalize();
                }
              }).end();
            };
          } catch (err) {
            // triggered when there are no matches
          }



        });
      }
    }
  }
})();
