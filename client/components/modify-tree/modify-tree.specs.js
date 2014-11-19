describe('Modify-Tree', function() {
  var $rootScope, $scope, Auth;
  beforeEach(module('baseApp')); // the specific module
  beforeEach(inject(function($injector) {

    $rootScope = $injector.get('$rootScope');
    $scope = $rootScope.$new();
    modifyTree = $injector.get('modifyTree')
    var $controller = $injector.get('$controller');

  }));

  describe('universe is ok', function(){
    it('should not have broken reality', function(){
      expect(true).toBe(true);
    });
  });

  describe('modifyTree has the right functions', function(){
    it('should have addNode and removeNode functions', function(){
      expect(modifyTree.addNode).toEqual(jasmine.any(Function));
      expect(modifyTree.removeNode).toEqual(jasmine.any(Function));
    });
  });

});
