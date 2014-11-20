describe('Workspace', function() {
  var $rootScope, $scope;
  beforeEach(module('baseApp')); // the specific module
  beforeEach(inject(function($injector) {

    workspace = $injector.get('workspace');

  }));

  describe('universe is ok', function(){
    it('should not have broken reality', function(){
      expect(true).toBe(true);
    })
  })

  describe('workspace has the right functions\n', function(){
    it('should have a getComponentNode function', function(){
      expect(workspace.getComponentNode).toEqual(jasmine.any(Function));
    });
  });

})