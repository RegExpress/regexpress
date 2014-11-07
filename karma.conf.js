module.exports = function(config){
  config.set({

    basePath : './',

    files : [
      // be careful about globbing, make sure that the stuff you need first is globbed first
      'client/bower_components/angular/angular.js',
      'client/bower_components/angular-route/angular-route.js',
      'client/bower_components/angular-mocks/angular-mocks.js',

      'client/app/main/main.js',

      'client/components/**/*.controller.js',
      'client/components/**/*.specs.js'

    ],

    autoWatch : true,

    frameworks: ['jasmine'],

    browsers : ['Chrome'],

    plugins : [
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-jasmine',
            'karma-junit-reporter'
            ],

    junitReporter : {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    }

  });
};