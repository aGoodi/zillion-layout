var gulp = require('gulp'),
    { src, dest, parallel, watch } = require('gulp'),
    fileinclude = require("gulp-file-include"),
    scss = require('gulp-sass')(require('sass')),
    browserSync = require('browser-sync').create(),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify-es').default,
    autoprefixer = require('gulp-autoprefixer'),
    shorthand = require('gulp-shorthand'),
    cleancss = require('gulp-clean-css'),
    imagecomp = require('compress-images'),
    clean = require('gulp-clean');

function startwatch() {
    watch(['src/**/*.js', '!src/**/*.min.js'], scripts);
    watch(['src/**/*.{scss, css}'], styles);
    watch('src/**/*.html').on('change', browserSync.reload);
    watch('src/img/**/*', images);
}

function browsersync() {
    browserSync.init({
        server: { baseDir: 'dist/' },
        notify: false,
        online: true
    })
}

function html() {
    return src('src/index.html')
    .pipe(fileinclude())
    .pipe(dest('dist/'))
    .pipe(browserSync.stream())
}

function scripts() {
    return src([
        'node_modules/jquery/dist/jquery.min.js',
        'src/main.js'
    ])
    .pipe(concat('main.min.js'))
    .pipe(uglify())
    .pipe(dest('dist/'))
    .pipe(browserSync.stream())
}

function styles() {
    return src('src/main.scss')
    .pipe(eval(scss)())
    .pipe(concat('main.min.css'))
    .pipe(autoprefixer({ overrideBrowserslist: ['last 10 versions'], grid: true }))
    .pipe(cleancss( { level: { 1: { specialComments: 0 } }/* , format: 'beautify' */ } ))
    .pipe(shorthand())
    .pipe(dest('dist/'))
    .pipe(browserSync.stream())
}

async function images() {
    imagecomp(
        "src/img/**/*",
        "dist/img/",
        { compress_force: false, statistic: true, autoupdate: true },
        false,
        { jpg: { engine: "mozjpeg", command: ["-quality", "60"] } },
        { png: { engine: "pngquant", command: ["--quality=20-50", "-o"] } },
        { svg: { engine: "svgo", command: "--multipass" } },
        { gif: { engine: "gifsicle", command: ["--colors", "64", "--use-col=web"] },},
        function (err, completed) {
          if (completed === true) {
            browserSync.reload();
          }
        }
    );
}

function cleanimg() {
    return src('dist/img/', { allowEmpty: true }).pipe(clean())
}

exports.browsersync = browsersync;
exports.html = html;
exports.scripts = scripts;
exports.styles = styles;
exports.images = images;
exports.cleanimg = cleanimg;
exports.default = parallel(styles, images, scripts, browsersync, startwatch);