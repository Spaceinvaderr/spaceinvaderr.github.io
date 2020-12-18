/*global require, __dirname, module */

'use strict';

// dependencies
const gulp = require('gulp');
const markdownpdf = require('gulp-markdown-pdf');
const rename = require("gulp-rename");
const NwBuilder = require('node-webkit-builder');

// node.js modules
const path = require('path');
const del = require('del');
const cjson = require('cjson');

// show simple help menu
require('gulp-help')(gulp);

let paths = {
    scripts: [path.join(__dirname, 'app', 'scripts', 'core', '**', '*js')]
};

// -----------------------------------------------------------------------------------------------------------------

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
        .pipe(rename('docs/help.pdf'))
        .pipe(gulp.dest('./app/'));
});

