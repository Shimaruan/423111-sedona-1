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

gulp.task("style", function() {
  gulp.src("source/sass/style.scss")
    .pipe(plumber())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(gulp.dest("source/css"))
    .pipe(server.stream())
    .pipe(csso())
    .pipe(rename("style-min.css"))
    .pipe(gulp.dest("source/css"));
});

gulp.task("imagemin", function() {
  gulp.src("source/img/**/*.{jpg,png,svg,gif}")
    .pipe(imagemin({
      progressive: true
    }))
    .pipe(gulp.dest("source/img"))
});

gulp.task("webp", function() {
    gulp.src("source/img/**/*.{jpg,png,gif}")
        .pipe(webp())
        .pipe(gulp.dest("source/img"))
});

gulp.task("clean", function () {
  return del("build");
});

gulp.task("copy", function () {
  return gulp.src([
      "source/fonts/**/*.{woff,woff2}",
      "source/img/**",
      "source/js/**",
      "source/css/**",
      "source/*.html"
    ], {
      base: "source"
    })
    .pipe(gulp.dest("build"));
});

gulp.task("build", function (done) {
  run(
    "style",
    "clean",
    "copy",
    done
  );
});

gulp.task("serve", ["style"], function() {
  server.init({
    server: "source/",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch("source/sass/**/*.{scss,sass}", ["style"]);
  gulp.watch("source/*.html").on("change", server.reload);
});
