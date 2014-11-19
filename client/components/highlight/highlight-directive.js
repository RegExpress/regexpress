(function() {
	'use strict';

	angular
		.module('baseApp')
		.directive('highlightMatches', highlightMatches);

	function highlightMatches() {

		return {
			restrict: "A",
			template: '<div>I dont know yet</div>',
			link: function(scope, element, attrs) {
				console.log("we're getting here!")
				// watches for changes in regex, and test string, then modifies the test string to reflect the highlighted matches.
				scope.$watch('main.matches', function(newVal, oldVal){
					try {
						console.log("we're getting here")
						$(document).ready(function(){
							$('#textarea').highlightTextarea({
	    					words: ['Lorem ipsum', 'shan']
	  					});
						}
					} catch (err) {
						console.log(err, "error")
					}
				});
			}
		}
	}
})();
