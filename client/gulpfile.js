var gulp = require('gulp');
var gutil = require('gulp-util');
var replace = require('gulp-replace');
var concat = require('gulp-concat');
var connect = require('gulp-connect');
var sass = require('gulp-sass');

var del = require('del');
var fs = require("fs");

var _ = require("lodash");

var paths = {
    templates: __dirname + '\\templates',
    templateGlob: 'templates/*.html',
    scripts: ['js/*.js', 'js/**/*.js'],
    sass: ["scss/**/*.scss", "scss/*.scss"],
    html: ['*.html'],
    assets: ['assets/*']
};

gulp.task('clean', function() {
  return del.sync("_build");
});

gulp.task('js', function () {
    // todo: vendor stuff

    return gulp.src(paths.scripts)
        .pipe(gulp.dest("_build/js"));
});

gulp.task('sass', function () {
  return gulp.src("scss/*.scss")
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('_build/css'));
});

gulp.task('templates', function () {
    var templates = fs.readdirSync(paths.templates);
    var templateData = _.reduce(templates, function (acc, name) {
        acc[name] = fs.readFileSync(paths.templates + "\\" + name, "utf8");

        return acc;
    }, {});

    return gulp.src(paths.html)
        .pipe(replace(/\{%(.*)%\}/gi, function (match, p1) {
            var arr = p1 && p1.trim().split(" ");
            var includePath = _.last(arr);

            if (includePath) {
                return templateData[includePath];    
            } 
            
        }))
        .pipe(gulp.dest('_build'));
});

gulp.task('assets', function () {
    return gulp.src(paths.assets)
        .pipe(gulp.dest("_build/assets"));
});

gulp.task('connect', function() {
  connect.server({
    root: '_build',
    livereload: true
  });
});

gulp.task("watch", ['build'], function () {
    var action = ['clean', 'build'];

    gulp.watch(paths.scripts, action);
    gulp.watch(paths.sass, action);
    gulp.watch(paths.html, action);
    gulp.watch(paths.assets, action);
    gulp.watch(paths.templateGlob, action);
});

gulp.task('build', ['clean', 'templates', 'assets', 'js', 'sass']);

gulp.task('default', ['connect', 'watch']);
