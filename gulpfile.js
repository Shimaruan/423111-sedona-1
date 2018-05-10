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
    .pipe(gulp.dest("build/css"))
    .pipe(csso())
    .pipe(rename("style-min.css"))
    .pipe(gulp.dest("build/css"))
    .pipe(server.stream())
});

gulp.task("imagemin", function() {
  gulp.src("source/img/**/*.{jpg,png,svg,gif}")
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

gulp.task("picturefill-make", function() {
  return  gulp.src("node_modules/picturefill/dist/picturefill.min.js")
    .pipe(gulp.dest("build/js"));
});

gulp.task("picturefill-name", function() {
  return  gulp.src("build/js/picturefill.min.js")
    .pipe(rename("picturefill-min.js"))
    .pipe(gulp.dest("build/js/"));
});

gulp.task("picturefill-delete", function () {
  return del("build/js/picturefill.min.js");
});

gulp.task("picturefill", function (done) {
  run(
    "picturefill-make",
    "picturefill-name",
    "picturefill-delete",
    done
  );
});

gulp.task("clean", function () {
  return del("build");
});

gulp.task("copy", function () {
  return gulp.src([
      "source/fonts/**/*.{woff,woff2}",
      "source/js/**",
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
    "picturefill",
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
