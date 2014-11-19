module.exports = function(config) {
  config.set({
    browsers: ['PhantomJS'],
    basePath : '',

    plugins : [
            'karma-phantomjs-launcher',
            'karma-jasmine'
            ],
    files : [
      // be careful about globbing, make sure that the stuff you need first is globbed first
      'client/bower_components/angular/angular.js',
      'client/bower_components/angular-route/angular-route.js',
      'client/bower_components/angular-mocks/angular-mocks.js',
      'client/bower_components/hammerjs/hammer.js',
      'client/bower_components/angular-material/angular-material.js',
      'client/bower_components/angular-animate/angular-animate.js',
      'client/bower_components/angular-aria/angular-aria.js',
      'client/bower_components/angular-loader/angular-loader.js',
      'client/app/main/main.js',
      'client/app/main/main.service.js',
      'client/components/**/*.directive.js',
      'client/components/**/*.service.js',
      'client/components/**/*.factory.js',
      'client/components/**/*.specs.js'
    ],
    autoWatch : true,
    frameworks: ['jasmine'],
  });
};
