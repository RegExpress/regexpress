module.exports = function(config) {
  config.set({
    browsers: ['PhantomJS'],
    basePath : './',

    plugins : [
            'karma-phantomjs-launcher',
            'karma-jasmine'
            ],
    files : [
      // be careful about globbing, make sure that the stuff you need first is globbed first
      'client/bower_components/angular/angular.js',
      'client/bower_components/angular-route/angular-route.js',
      'client/bower_components/angular-mocks/angular-mocks.js',
      'client/app/main/main.js',
      'client/components/**/*.directive.js',
      'client/components/**/*.specs.js'
    ],
    autoWatch : true,
    frameworks: ['jasmine'],
  });
};
