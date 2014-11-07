console.log('running workspace controller specs');

describe('Workspace', function() {
  beforeEach(module('baseApp')); // the specific module

  var ctrl, scope;

  beforeEach(inject(function($controller, $rootScope) {

    scope = $rootScope.$new();

    ctrl = $controller('Workspace', {
      $scope: scope
    })

  }))

  describe('universe is ok', function(){
    it('should not have broken reality', function(){
      expect(true).toBe(true);
    })
  })

  describe('scope has the right stuff on it', function(){
    it('should have a space attr', function(){
      expect(scope.workspace.space).toBeDefined();
    })
  })

})