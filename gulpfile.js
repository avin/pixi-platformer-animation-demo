var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var gutil = require("gulp-util");
var webpack = require("webpack");
var WebpackDevServer = require("webpack-dev-server");
var webpackConfig = require("./webpack.config.js");
var stream = require('webpack-stream');


var path = {
    HTML: 'public/index.html',
    ALL: ['src/**/*.es6'],
    MINIFIED_OUT: 'app.min.js',
    DEST_SRC: 'dist/src',
    DEST_BUILD: 'dist/build',
    DEST: 'dist'
};

gulp.task('webpack', [], function () {
    return gulp.src(path.ALL) // gulp looks for all source files under specified path
        .pipe(sourcemaps.init()) // creates a source map which would be very helpful for debugging by maintaining the
        // actual source code structure
        .pipe(stream(webpackConfig)) // blend in the webpack config into the source files
        .pipe(uglify())// minifies the code for better compression
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.DEST_BUILD));
});

gulp.task("webpack-dev-server", function (callback) {
    // modify some webpack config options
    var myConfig = Object.create(webpackConfig);
    myConfig.devtool = "eval";
    myConfig.debug = true;

    // Start a webpack-dev-server
    new WebpackDevServer(webpack(myConfig), {
        publicPath: "/" + myConfig.output.publicPath,
        stats: {
            colors: true
        }
    }).listen(8080, "localhost", function (err) {
        if (err) {
            throw new gutil.PluginError("webpack-dev-server", err);
        }
        gutil.log("[webpack-dev-server]", "http://localhost:8080/webpack-dev-server/index.html");
    });
});

gulp.task('copy', function () {

    gulp.src([
        './bower_components/pixi.js/bin/pixi.js',
        './bower_components/randomcolor/randomColor.js',
        './bower_components/Keypress/keypress.js',
    ]).pipe(gulp.dest('dist/build/libs'));

    gulp.src('./resources/**/*.*').pipe(gulp.dest('dist/resources'));

});


gulp.task('watch', function () {
    gulp.watch(path.ALL, ['webpack']);
});

gulp.task('default', ['copy', 'webpack-dev-server', 'watch']);