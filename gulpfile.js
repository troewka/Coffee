const { src, dest, watch, series, parallel } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const cleanCSS = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const babel = require('gulp-babel');
const browserSync = require('browser-sync').create();

// Шляхи
const paths = {
  html: 'src/*.html',
  styles: 'src/scss/**/*.scss',
  scripts: 'src/js/**/*.js',
  dist: 'dist/',
};

// HTML
function htmlTask() {
  return src(paths.html).pipe(dest(paths.dist)).pipe(browserSync.stream());
}

// SCSS → CSS
function stylesTask() {
  return src(paths.styles)
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(concat('style.css'))
    .pipe(cleanCSS())
    .pipe(sourcemaps.write('.'))
    .pipe(dest(paths.dist + 'css'))
    .pipe(browserSync.stream());
}

// JS
function scriptsTask() {
  return src(paths.scripts)
    .pipe(sourcemaps.init())
    .pipe(babel({ presets: ['@babel/preset-env'] }))
    .pipe(concat('script.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(dest(paths.dist + 'js'))
    .pipe(browserSync.stream());
}

// Watch + live reload
function serveTask() {
  browserSync.init({ server: { baseDir: paths.dist } });
  watch(paths.html, htmlTask);
  watch(paths.styles, stylesTask);
  watch(paths.scripts, scriptsTask);
}

// Експорти
exports.default = series(
  parallel(htmlTask, stylesTask, scriptsTask),
  serveTask
);
