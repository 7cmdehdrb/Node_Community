const gulp = require("gulp")

const css = () => {
    const postCSS = require("gulp-postCSS");
    const sass = require("gulp-sass");
    const minify = require("gulp-csso");
    sass.compiler = require("node-sass");
    return gulp
        .src("assets/scss/styles.scss")
        .pipe(sass().on("error", sass.logError))
        .pipe(postCSS([require("tailwindcss"), require("autoprefixer")]))
        .pipe(minify())
        .pipe(gulp.dest("public/stylesheets"));
};

exports.default = css;