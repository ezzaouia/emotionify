/**
 * Created by mohamed on 20/04/2016.
 */

'use strict'

const
    gulp = require('gulp'),
    /*
    browserify = require('browserify'),
    watchify = require('watchify'),

    gsourcemaps = require('gulp-sourcemaps'),
    guglify = require('gulp-uglify'),
    ngAnnotate = require('gulp-ng-annotate'),

    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    */
    browserify = require('gulp-browserify')




let customOpts = {
    entries: ['./assets/js/main.js'],
    debug: true
}

// let __bundler = browserify(customOpts)

gulp.task('bundle', function () {
    return gulp.src('./client/assets/js/main.js')
        .pipe(browserify())
        .pipe(gulp.dest('./client/dist/'))
})

gulp.task('build', function () {
    console.log('build')
})