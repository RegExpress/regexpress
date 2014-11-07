console.log('running test-string controller specs');

describe('TestString', function() {
  beforeEach(module('baseApp')); // the specific module

  var ctrl, scope;

  beforeEach(inject(function($controller, $rootScope) {

    scope = $rootScope.$new();

    ctrl = $controller('TestString', {
      $scope: scope
    })

  }))

  describe('universe is ok', function(){
    it('should not have broken reality', function(){
      expect(true).toBe(true);
    })
  })

  describe('scope has the right stuff on it', function(){
    it('should have a str attr', function(){
      expect(scope.string).toBeDefined();
    })
  })

})