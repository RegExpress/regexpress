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
      expect(makeMatches.getMatchHTML('abc', /\d+/)).toEqual(jasmine.any(String));
    });

    it('should handle no matches', function(){
      expect(makeMatches.getMatchHTML('abc efg higj', /\d+/g)).toBe('abc efg higj');
    });

    it('should handle a single match', function(){
      expect(makeMatches.getMatchHTML('abc 123', /\d+/)).toBe('abc <span class="hilight">123</span>');
    });

    it('should handle more than one match', function(){
      expect(makeMatches.getMatchHTML('abc 123 efg 456', /\d+/g)).toBe('abc <span class="hilight">123</span> efg <span class="hilight">456</span>');
    });

    it('should handle many matches', function(){
      expect(makeMatches.getMatchHTML('abc 123 efg 456 er 3435 eret 345 h 3 rerer 44', /\d+/g)).toBe('abc <span class="hilight">123</span> efg <span class="hilight">456</span> er <span class="hilight">3435</span> eret <span class="hilight">345</span> h <span class="hilight">3</span> rerer <span class="hilight">44</span>');
    });
  });
});