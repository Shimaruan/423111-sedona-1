"use strict";

var gulp = require("gulp");
var sass = require("gulp-sass");
var plumber = require("gulp-plumber");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var server = require("browser-sync").create();
var csso = require("gulp-csso");
var rename = require("gulp-rename");
var imagemin = require("gulp-imagemin");
var webp = require("gulp-webp");
var del = require("del");
var run = require("run-sequence");
var posthtml = require("gulp-posthtml");
var include = require("posthtml-include");
var htmlmin = require("gulp-htmlmin");
var svgstore = require("gulp-svgstore");
var uglify = require("gulp-uglify");

gulp.task("html", function() {
  return gulp.src("source/*.html")
    .pipe(posthtml([
      include()
    ]))
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest("build"));
});

gulp.task("style", function() {
  gulp.src("source/sass/style.scss")
    .pipe(plumber())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(gulp.dest("build/css"))
    .pipe(csso())
    .pipe(rename("style-min.css"))
    .pipe(gulp.dest("build/css"))
    .pipe(server.stream())
});

gulp.task("js-min", function() {
  return  gulp.src("source/js/*.js")
    .pipe(uglify())
    .pipe(rename({suffix: "-min"}))
    .pipe(gulp.dest("build/js"));
 });

gulp.task("imagemin", function() {
  gulp.src([
    "source/img/**/*.{png,jpg,svg,gif}",
    "!source/img/icon-*.svg"
  ])
    .pipe(imagemin([
      imagemin.gifsicle({interlaced: true}),
      imagemin.jpegtran({progressive: true}),
      imagemin.optipng({optimizationLevel: 3}),
      imagemin.svgo({
        plugins: [
          {removeViewBox: false}
        ]
      })
    ]))
    .pipe(gulp.dest("build/img"))
});

gulp.task("webp", function() {
    gulp.src("source/img/**/*.{jpg,png,gif}")
        .pipe(webp())
        .pipe(gulp.dest("build/img"))
});

gulp.task("icons", function() {
  return gulp.src("source/img/icon-*.svg")
    .pipe(imagemin(
      imagemin.svgo({
        plugins: [
          {removeViewBox: false}
        ]
      })
    ))
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(rename("icons.svg"))
    .pipe(gulp.dest("tmp"));
});

gulp.task("picturefill", function() {
  return  gulp.src("node_modules/picturefill/dist/picturefill.min.js")
    .pipe(rename("picturefill-min.js"))
    .pipe(gulp.dest("build/js"));
});

gulp.task("clean", function () {
  return del("build");
});

gulp.task("copy", function () {
  return gulp.src([
      "source/fonts/**/*.{woff,woff2}",
      "source/js/**"
    ], {
      base: "source"
    })
    .pipe(gulp.dest("build"));
});

gulp.task("build", function (done) {
  run(
    "clean",
    "icons",
    "html",
    "style",
    "js-min",
    "imagemin",
    "webp",
    "copy",
    "picturefill",
    done
  );
});

gulp.task("serve", ["style"], function() {
  server.init({
    server: "build/",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch("source/sass/**/*.{scss,sass}", ["style"]);
  gulp.watch("source/*.html", ["html"]).on("change", server.reload);
});
