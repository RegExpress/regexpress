describe('matches', function() {
  var $rootScope, $scope, makeMatches;
  beforeEach(module('baseApp')); // the specific module
  beforeEach(inject(function($injector) {

    makeMatches = $injector.get('makeMatches');

  }));

  describe('universe is ok', function(){
    it('should not have broken reality', function(){
      expect(true).toBe(true);
    });
  });

  describe('makeMatches has the right functions', function(){
    it('should have a getMatchHTML function', function(){
      expect(makeMatches.getMatchHTML).toEqual(jasmine.any(Function));
    });
  });

  describe('getMatchHTML should work properly', function(){
    it('should return a string', function(){
      expect(makeMatches.getMatchHTML('abc 123', /\d+/)).toEqual(jasmine.any(String));
    });

    it('should handle a single match', function(){
      expect(makeMatches.getMatchHTML('abc 123', /\d+/)).toBe('abc <span class="hilight">123</span>');
    });

    xit('should handle more than one match', function(){
      expect(makeMatches.getMatchHTML('abc 123 efg 456', /\d+/g)).toBe('abc <span class="hilight">123</span> efg <span class="hilight">456</span>');
    });
  });
});