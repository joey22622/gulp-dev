const themename = 'THEME_ID_HERE'
const proxy = 'http://localhost:8888/LOCAL_DIRECTORY_HERE'

const gulp = require('gulp'),
  // Prepare and optimize code etc
  autoprefixer = require('autoprefixer'),
  browserSync = require('browser-sync').create(),
  image = require('gulp-image'),
  jshint = require('gulp-jshint'),
  postcss = require('gulp-postcss'),
  sass = require('gulp-sass'),
  sourcemaps = require('gulp-sourcemaps'),
  terser = require('gulp-terser'),
  concat = require('gulp-concat'),
  uglifycss = require('gulp-uglifycss'),
  jsMinify = require('gulp-minify')

// Only work with new or updated files
;(newer = require('gulp-newer')),
  // Name of working theme folder
  (root = '../wp-content/themes/' + themename + '/'),
  (dev = root + 'dev/'),
  (scss = dev + 'sass/'),
  (js = dev + 'js/'),
  (img = root + 'images/'),
  (languages = root + 'languages/')

// CSS via Sass and Autoprefixer
gulp.task('css', () => {
  return gulp
    .src(scss + '{style.scss,rtl.scss}')
    .pipe(sourcemaps.init())
    .pipe(
      sass({
        outputStyle: 'expanded',
        indentType: 'tab',
        indentWidth: '1',
      }).on('error', sass.logError)
    )
    .pipe(postcss([autoprefixer('last 2 versions', '> 1%')]))
    .pipe(sourcemaps.write(scss + 'maps'))
    .pipe(gulp.dest(root + 'css'))
})
gulp.task('cssMin', () => {
  return gulp
    .src(root + 'css/style.css')
    .pipe(concat('style-min.css'))
    .pipe(uglifycss())
    .pipe(gulp.dest(root + 'css'))
})

// Optimize images through gulp-image
gulp.task('images', () => {
  return gulp
    .src(img + 'RAW/**/*.{jpg,JPG,png}')
    .pipe(newer(img))
    .pipe(image())
    .pipe(gulp.dest(img))
})

// JavaScript
gulp.task('javascript', () => {
  console.log('js')
  return (
    gulp
      .src([js + '*.js'])
      // .pipe(jshint())
      // .pipe(jshint.reporter('default'))
      .pipe(jsMinify())
      .pipe(gulp.dest(root + 'js/'))
  )
})

// Watch everything
gulp.task('watch', () => {
  console.log('hi there')
  browserSync.init({
    notify: false,
    open: 'external',
    proxy,
    port: 8080,
  })
  gulp.watch(
    [root + '**/*.scss'],
    { interval: 1000 },
    gulp.series(['css', 'cssMin'])
  )
  gulp.watch(js + ['**/*.js'], gulp.series('javascript'))
  gulp.watch(
    img + 'RAW/**/*.{jpg,JPG,png}',
    { interval: 3000 },
    gulp.parallel('images')
  )
  gulp.watch(root + '**/*').on('change', browserSync.reload)
})

gulp.task('default', gulp.series(['watch']))
