'use strict';

var gulp = require('gulp');
var less = require('gulp-less');
// Only passes the files which are changed
var changed = require('gulp-changed');

// Adds the vendor prefixes (like -webkit -moz etc) into the css
var autoprefixer = require('autoprefixer-core');

// Binds js files, makes import possible
var browserify = require('browserify');

// Keeps track of which files should be watched
var watchify = require('watchify');

// Makes it easier to use browserify with gulp (prevent unecessary overhead)
var source = require('vinyl-source-stream');

// changes vinyl-source-stream to a buffer
var buffer = require('vinyl-buffer');

// Wrapper around esling to work with gulp
var eslint = require('gulp-eslint');

// Converts ES6 to ES5
var babelify = require('babelify');

// Deletes a file or directory
var del = require('del');

// Notify plugin, it does what is says
var notify = require('gulp-notify');

// Keeps browsers and devices in sync with latest changes in your code
var browserSync = require('browser-sync');

// Gulp plugin to pipe CSS through several processors, but parse CSS only once.
var postcss = require('gulp-postcss');

// Places all the js and css files in the building blocks in the index.html into one file.
var htmlReplace = require('gulp-html-replace');

// Optimize PNG, JPG, GIF, SVG images
var image = require('gulp-image');

var csso = require('gulp-csso');

var reload = browserSync.reload;
var config = {
    jsx: './scripts/app.jsx',
    less: 'styles/**/*.less',
    bundle: 'app.js',
    distJs: 'dist/js',
    distCss: 'dist/css',
    distHtml: 'dist',
    distImg: 'dist/img',
    npmDir: './node_modules'
};

// Same as rm -rf dist
gulp.task('clean', function(cb) {
    del(['dist'], cb);
});


// Sets up the browser sync task, which starts the plugin browsersync
gulp.task('browserSync', function() {
    browserSync({
        server: {
            baseDir: './'
        },
        open: false
    });
});

// Sets up the task watchify,
// which configurates which files to watch and what to do when a file has changed.
gulp.task('watchify', function() {
    var bundler = watchify(browserify(config.jsx, watchify.args));

    function rebundle() {
        return bundler
            .bundle()
            .on('error', notify.onError())
            .pipe(source(config.bundle))
            .pipe(gulp.dest(config.distJs))
            .pipe(reload({
                stream: true
            }));
    }

    bundler.transform(babelify)
        .on('update', rebundle);
    return rebundle();
});

// Tells browserify how to bundle all the files
gulp.task('browserify', function() {
    browserify(config.jsx)
        .transform(babelify)
        .bundle()
        .pipe(source(config.bundle))
        .pipe(buffer())
        .pipe(gulp.dest(config.distJs));
});

// Parses and process the style files (from scss to css)
gulp.task('styles', function() {
    return gulp.src(config.less)
        .pipe(changed(config.distCss))
        .pipe(less({
            paths: [config.npmDir + '/bootstrap/less/']
        }))
        .on('error', notify.onError())
        .pipe(postcss([autoprefixer('last 1 version')]))
        .pipe(csso())
        .pipe(gulp.dest(config.distCss))
        .pipe(reload({
            stream: true
        }));
});

gulp.task('html-replace', function() {
    var replacements = {
        css: 'css/main.css',
        js: 'js/app.js'
    };

    return gulp.src('*.html')
        .pipe(htmlReplace(replacements))
        .pipe(gulp.dest(config.distHtml));
});

gulp.task('image', function() {
    return gulp.src('img/**')
        .pipe(image())
        .pipe(gulp.dest(config.distImg));
});

// Lint is used for detecting correct syntax and style
gulp.task('lint', function() {
    return gulp.src('scripts/**/*.jsx')
        .pipe(eslint())
        .pipe(eslint.format());
});

gulp.task('watchTask', function() {
    gulp.watch(config.scss, ['styles']);
    gulp.watch('scripts/**/*.jsx', ['lint']);
});

gulp.task('watch', ['clean'], function() {
    gulp.start(['browserSync', 'watchTask', 'watchify', 'styles', 'lint', 'image']);
});

gulp.task('build', ['clean'], function() {
    process.env.NODE_ENV = 'production';
    gulp.start(['browserify', 'styles', 'html-replace', 'image']);
});

gulp.task('default', function() {
    console.log('Run "gulp watch or gulp build"');
});
