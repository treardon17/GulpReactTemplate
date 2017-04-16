var gulp = require('gulp');
var react = require('gulp-react');
var sass = require('gulp-sass');
var prefix = require('gulp-autoprefixer');
var browserSync = require('browser-sync').create();
var babel = require('gulp-babel');
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var runSequence = require('run-sequence');

var babelify = require('babelify');

const paths = {
  dev:{
    root: './app/',
    ui: './app/ui/',
    pages: './app/ui/pages',
    components: './app/ui/components/',
  },
  build:{
    root: './build/',
    js: './build/resources/js/',
    css: './build/resources/css/',
  }
}

gulp.task('html', ()=>{
  return gulp.src(paths.dev.root+'**/*.html')
  .pipe(gulp.dest(paths.build.root))
});

gulp.task('sass', ()=>{
  return gulp.src(paths.dev.root+'**/*.scss')
  .pipe(sass())
  .pipe(concat('styles.css'))
  .on('error', sass.logError)
  .pipe(prefix(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], {
      cascade: true
  }))
  .pipe(gulp.dest(paths.build.css))
});

function compile() {
  var bundler = browserify(paths.dev.root+'index.js');
  return bundler
    .transform('babelify', { presets: ['es2015', 'react'] })
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(gulp.dest(paths.build.js));
}

gulp.task('js', function() {
  return compile();
});

function reloadBrowser(){
  browserSync.reload();
}

gulp.task('watch', ()=>{
  gulp.watch([paths.dev.root+'**/*.js'], ()=>{
    runSequence('js', reloadBrowser)
  });
  gulp.watch([paths.dev.root+'**/*.scss'], ()=>{
    runSequence('sass', reloadBrowser)
  });
  gulp.watch([paths.dev.root+'**/*.html'], ()=>{
    runSequence('html', reloadBrowser)
  });
});

//Set up browser-sync server (html)
gulp.task('browser-sync', ['js', 'sass', 'html'], ()=>{
    browserSync.init({
        server: {
            baseDir: paths.build.root
        },
        notify: false,
        watchOptions:{
            ignored: 'node_modules/*'
        }
    });
});

gulp.task('build', ['js', 'sass', 'html']);
gulp.task('default', ['browser-sync', 'watch']);
