(function(){
  var gulp  = require('gulp');
  var $     = require('gulp-load-plugins')({lazy:false});
  var del   = require('del');
  var wiredep = require('wiredep');
  $.livereload();

// Set up paths hashes for client directory
var paths = {
  index: './client/index.html',
  root: './client',
  html: './client/**/*.html',
  scripts: './client/app/**/*.js',
  styles: './client/app/**/*.css',
  bower: './client/bower_components',
  images: './client/images/**/*',
  templates: ['./client/**/*.html', '!./client/bower_components/**/*.html']
};

// Set up paths hashes for paths directory
var dist = {
  root: './dist',
  index: './dist/index.html',
  scripts: './dist/scripts',
  styles: './dist/styles',
  bower: './dist/bower_components',
  images: './dist/images',
  templates: './dist/scripts'

};

// options that we can easily reference later on.
var options = {
  templates: {
    name: 'templates.js',
    options: {
      module: 'gifchatClientApp'
    }
  },
  inject: {
    scripts: {
      relative: true,
      name: 'app',

    },
    styles: {
      relative: true,
      name: 'styles'
    }
  }
}
// Lets declare our actual tasks & what they do below
//=========================================================

// Dev tasks - wont 'build' anything aka doesn't dump into dist folder.
//==================================
gulp.task('default', $.sequence('inject:dev', 'wire:dev', 'server:dev', 'watch:dev'));
// serves stuff in the client folder
gulp.task('server:dev', startServerDev);
// watches for changes in client folder
gulp.task('watch:dev', startWatchDev);
// injects our css & js into index.html
gulp.task('inject:dev', injectDev);
// injects bower stuff into index.html
gulp.task('wire:dev', wireBower);

// Dist tasks - reads from client folder and shits out stuff into the dist (production ready) folder
//===================================

// builds from client folder -> dist folder
gulp.task('build', $.sequence('clean','copy', ['templates:dist','styles:dist','scripts:dist','image:dist','bower:dist'], 'inject:dist', 'wire:dist'));
// default dist task: builds, serves & watches
gulp.task('dist', $.sequence('build', 'server:dist', 'watch:dist'));
// serve up files from the dist directory
gulp.task('server:dist', startServerProd);
// wire bower deps into index.html
gulp.task('wire:dist', wireBowerDist);
// watch for changes in our dist directory
gulp.task('watch:dist', startWatchDist);
// minify, etc css
gulp.task('styles:dist', stylesDist);
// moves bower stuff over into dist folder
gulp.task('bower:dist', bowerFilesDist);
// injects our css and js files into index.html
gulp.task('inject:dist', injectDist);
// does stuff to our js
gulp.task('scripts:dist', scriptsDist);
// minifyt & moves images
gulp.task('image:dist', imagesDist);
// copies all other files into the dist folder
gulp.task('copy',copyFiles);
// creates a giant folder of all of our angular partials
gulp.task('templates:dist', templatesDist);
// empties out the entire dist folder, with the exception of any git files (cuz dist is a git repo as well)
gulp.task('clean', del.bind(null, ['!.git*','./dist/**/*']));

// ===============================
// The following are what actually happens when a specific gulp task happens
// ===============================

// Server functions
//============================
function startServerDev(){
  // set dev env so dist folder isnt served
  process.env.NODE_ENV = 'development';
  require('./server');

}

function startServerProd(){
  // set prod env so dist folder is served
  process.env.NODE_ENV = 'production';
  require('./server');

}
// Watch functions
//============================
function startWatchDev(){
  $.livereload.listen();
  // watch for changes in these files and let livereload know something happened
  gulp.watch(paths.root + '/app/**/*.css', $.livereload.changed);
  gulp.watch(paths.root + '/app/**/*.js', $.livereload.changed);
  gulp.watch(paths.root + '/**/*.html', $.livereload.changed);
}

function startWatchDist(){
  // NOTE THIS CURRENTLY DOESNT WORK
  // it watches the main folder but nothing actually builds :(
  $.livereload.listen();
  gulp.watch(paths.root + '/app/**/*.css', $.livereload.changed);
  gulp.watch(paths.root + '/app/**/*.js', $.livereload.changed);
  gulp.watch(paths.root + '/**/*.html', $.livereload.changed);

}
//inject functions
//===============================
function injectDev(){
  var target  = gulp.src( paths.index );
  var scripts = gulp.src( paths.scripts, {read:false} );
  var styles  = gulp.src( paths.styles, {read:false} );

  return target
    .pipe( $.inject( scripts,  options.inject.scripts ) )
    .pipe( $.inject( styles,  options.inject.styles ) )
    .pipe( gulp.dest( paths.root ) );
}

function injectDist(){
  var target = gulp.src( dist.index ) ;
  var scripts = gulp.src( dist.scripts + '/*.js' );
  var styles = gulp.src( dist.styles + '/*.css' );

  return target
    .pipe( $.inject( scripts,  options.inject.scripts ) )
    .pipe( $.inject( styles,  options.inject.styles ) )
    .pipe(gulp.dest(dist.root));
}
// Wire up bower deps (inject but for bower)
//=============================
function wireBower(){
  var wire = wiredep.stream;
  return gulp.src(paths.index)
    .pipe(wire({directory: paths.bower}))
    .pipe(gulp.dest(paths.root));

}
function wireBowerDist(){
  var wire = wiredep.stream;
  return gulp.src(dist.index)
    .pipe(wire({directory: dist.bower}))
    .pipe(gulp.dest(dist.root));

}
// Styles 4 Dist
// ============================
function stylesDist() {
  return gulp.src(paths.styles)
    .pipe($.concat('app.min.css'))
    .pipe($.cssmin())
    .pipe(gulp.dest(dist.styles));
}
// Do stuff to our scripts
//=====================================
function scriptsDist() {
  return gulp.src(paths.scripts)
    // ngAnnotate makes sure things are declared in a way that they can be minified
    .pipe($.ngAnnotate({add: true}))
    .pipe($.concat('app.min.js'))
    .pipe($.uglify())
    .pipe(gulp.dest(dist.scripts));
}
// Task that copies all files in our client root folder (not anything inside a folder)
// ====================================
function copyFiles() {
  return gulp.src(paths.root + '/*.*')
    .pipe(gulp.dest(dist.root));
}
// Move all of our bower files over to dist
//======================================
function bowerFilesDist() {
  return $.bower(paths.bower)
  .pipe(gulp.dest(dist.bower));
}

// Minify and move all images over
//=====================================
function imagesDist() {
  return gulp.src(paths.images)
    .pipe($.image())
    .pipe(gulp.dest(dist.images));
}
// Take all of our angular partials, and put them all in one 'template script'
//=======================================
function templatesDist() {
  return gulp.src(paths.templates)
    .pipe($.angularTemplatecache(options.templates.name, options.templates.options))
    .pipe(gulp.dest(dist.scripts));
}
})();
