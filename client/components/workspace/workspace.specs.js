console.log('running workspace controller specs');

describe('Workspace', function() {
  var $rootScope, $scope;
  beforeEach(module('baseApp')); // the specific module
  beforeEach(inject(function($injector) {

    $rootScope = $injector.get('$rootScope');
    $scope = $rootScope.$new();
    var $controller = $injector.get('$controller');

    createController = function() {
      return $controller('MainController', {
        $scope: $scope
      });
    };

    createController();

  }));

  describe('universe is ok', function(){
    it('should not have broken reality', function(){
      expect(true).toBe(true);
    })
  })

  describe('scope has the right stuff on it', function(){
    it('should have a space attr', function(){
      // expect(scope.workspace.space).toBeDefined();
    })
  })

})