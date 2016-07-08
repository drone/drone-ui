/* eslint-env node */
'use strict';

const gulp = require('gulp');
const gulpUtil = require('gulp-util');

gulp.task('lint', function () {
  const gulpEslint = require('gulp-eslint');

  return gulp.src(['./*.js', './src/**/*.{js,jsx}', './test/**/*.{js,jsx}'])
    .pipe(gulpEslint())
    .pipe(gulpEslint.format())
    .pipe(gulpEslint.failAfterError());
});

gulp.task('build-env', function () {
  process.env.NODE_ENV = 'production';
});

gulp.task('build-clean', function () {
  const del = require('del');

  del.sync('./dist');
});

gulp.task('build-webpack', ['build-env', 'build-clean'], function (done) {
  const webpack = require('webpack');
  const webpackConfig = require('./webpack.config.js')({dev: false, hot: false});
  const compiler = webpack(webpackConfig);

  compiler.run((err, result) => {
    if (!err) {
      if (result.compilation.errors.length > 0) {
        done(result.compilation.errors[0]);
      } else {
        done();
      }
    } else {
      done(err);
    }
  });
});

gulp.task('build', ['build-webpack'], function () {
  const gulpSize = require('gulp-size');

  return gulp.src('./dist/**/*.{js,css}')
    .pipe(gulpSize({showFiles: true, gzip: true}));
    // no need to do anything, just displaying assets size
});

gulp.task('default', function (done) { // eslint-disable-line no-unused-vars
  const drone = require('./drone.json');
  const webpackDevServer = require('./webpack.devserver');
  const host = 'localhost';
  const port = 9000;
  const hot = true;

  webpackDevServer(host, port, hot, drone, (err) => {
    if (!err) {
      gulpUtil.log(`Bound webpack dev-server to http://${host}:${port}`);
    }
  });
});

// ensure all subprocesses are killed after tasks have run or on interruption signals
gulp.doneCallback = (err) => process.exit(err ? 1 : 0);
process.on('SIGINT', () => process.exit(1));
process.on('SIGTERM', () => process.exit(1));
