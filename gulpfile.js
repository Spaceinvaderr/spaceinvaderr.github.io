// dependencies
let gulp = require('gulp');
let markdownpdf = require('gulp-markdown-pdf');
let rename = require("gulp-rename");
let NwBuilder = require('node-webkit-builder');
let browserify = require('gulp-browserify');


// node.js modules
let path = require('path');
let del = require('del');
let cjson = require('cjson');

// show simple help menu
require('gulp-help')(gulp);

let paths = {
    scripts: [path.join(__dirname, 'app', 'scripts', 'core', '**', '*js')]
};

gulp.task('build', 'Building application for distribution.', function (cb) {
    let nw = new NwBuilder({
        files: [
            'app/**/**',
            'package.json'
        ],
        platforms: ['win32', 'win64', 'osx32', 'osx64', 'linux32', 'linux64'],
        buildDir: './dist'
    });

    // nw.on('log', console.log);

    nw.build().then(function () {
        cb();
    }).catch(function (error) {
        console.error(error);
    });
});

gulp.task('build:help', 'Building help.pdf from README.md.', function () {
    return gulp.src('README.md')
        .pipe(markdownpdf())
        //.pipe(rename('docs/help.pdf'))
        .pipe(browserify({
            insertGlobals: true
        }))
        .pipe(gulp.dest('./app/'));
});

