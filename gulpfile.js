/**
 * created by boevi Lawson
 * https://github.com/ducdeswin7
 **/

var gulp = require('gulp'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    autoprefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    ignore = require('gulp-ignore');

var input = './stylesheets/**/*.scss',
    output = './public/css',
    jsInput = 'javascripts/*.js',
    jsOutput = 'public/javascripts',
    condition = '_*.scss';

var sassOptions = {
    errLogToConsole: true,
    outputStyle: 'compressed'
    },
    autoprefixerOptions = {
    browsers: ['last 2 versions', '> 5%', 'Firefox ESR']
    },
    sassdocOptions = {
        dest: './public/sassdoc'
    };

gulp.task('sass', function () {
    return gulp
    // Find all `.scss` files from the `stylesheets/` folder
        .src(input)
        .pipe(ignore.exclude(condition))
        // Run Sass on those files
        .pipe(sass(sassOptions).on('error', sass.logError))
        //source map
        .pipe(sourcemaps.write('./stylesheets/maps'))
        //
        .pipe(autoprefixer(autoprefixerOptions))
        // Write the resulting CSS in the output folder
        .pipe(gulp.dest(output))
        // Release the pressure back and trigger flowing mode (drain)
        // See: http://sassdoc.com/gulp/#drain-event
        .resume();
});

//use to auto documentation of sass
gulp.task('sassdoc', function () {
    return gulp
        .src(input)
        .pipe(sassdoc(sassdocOptions))
        .resume();
});

//use to compress js file
gulp.task('compress', function() {
    return gulp
        .src(jsInput)
        .pipe(uglify())
        .pipe(gulp.dest(jsOutput));
});


gulp.task('watch', function() {
    gulp
    // Watch the input folder for change,
    // and run `sass` task when something happens
        .watch(input, ['sass'])
        // When there is a change,
        // log a message in the console
        .on('change', function(event) {
            console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
        });
    gulp
        .watch(jsInput, ['compress'])
        .on('change', function(event) {
            console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
        });
});

//task for prod version
gulp.task('prod', ['sassdoc'], function () {
    return gulp
        .src(input)
        .pipe(sass({ outputStyle: 'compressed' }))
        .pipe(autoprefixer(autoprefixerOptions))
        .pipe(gulp.dest(output));
});

gulp.task('default', ['sass', 'compress' ,'watch' /*, possible other tasks... */]);
