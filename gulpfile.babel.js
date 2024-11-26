import autoprefixer from "autoprefixer";
import browserSync from "browser-sync";
import fs from "fs";
import gulp from "gulp";
import imagemin from "gulp-imagemin";
import plugins from "gulp-load-plugins";
import yaml from "js-yaml";
import panini from "panini";
import rimraf from "rimraf";
import sherpa from "style-sherpa";
import named from "vinyl-named";
import webpack2 from "webpack";
import webpackStream from "webpack-stream";
import yargs from "yargs";

const sass = require("gulp-sass")(require("sass-embedded"));
const postcss = require("gulp-postcss");
const uncss = require("postcss-uncss");
const faviconPath = "src/assets/img/favicon/favicon.ico"; // Adjusted path
const sourcemaps = require("gulp-sourcemaps");
const plumber = require("gulp-plumber");

// Load all Gulp plugins into one variable
const $ = plugins();

// Check for --production flag
const PRODUCTION = !!yargs.argv.production;

// Load settings from settings.yml
function loadConfig() {
  const unsafe = require("js-yaml-js-types").all;
  const schema = yaml.DEFAULT_SCHEMA.extend(unsafe);
  const ymlFile = fs.readFileSync("config.yml", "utf8");
  return yaml.load(ymlFile, { schema });
}
const { PORT, UNCSS_OPTIONS, PATHS } = loadConfig();

// Log UnCSS options for debugging
console.log(UNCSS_OPTIONS);

// Copy favicon to the `dist` folder
gulp.task("copy-favicon", function () {
  return gulp
    .src(faviconPath)
    .pipe(gulp.dest(`${PATHS.dist}/assets/img/favicon`))
    .pipe(browserSync.stream());
});

// Build the "dist" folder
gulp.task(
  "build",
  gulp.series(
    clean,
    gulp.parallel(pages, javascript, images, copy, "copy-favicon"),
    sassBuild,
    styleGuide
  )
);

// Build the site, run the server, and watch for file changes
gulp.task("default", gulp.series("build", server, watch));

// Delete the "dist" folder
function clean(done) {
  rimraf(PATHS.dist, (err) => {
    if (err) console.error(err);
    done();
  });
}

// Copy files out of the assets folder
function copy() {
  return gulp.src(PATHS.assets).pipe(gulp.dest(`${PATHS.dist}/assets`));
}

// Copy page templates into finished HTML files
function pages() {
  return gulp
    .src("src/pages/**/*.{html,hbs,handlebars}")
    .pipe(
      panini({
        root: "src/pages/",
        layouts: "src/layouts/",
        partials: "src/partials/",
        data: "src/data/",
        helpers: "src/helpers/",
      })
    )
    .pipe(gulp.dest(PATHS.dist));
}

// Load updated HTML templates and partials into Panini
function resetPages(done) {
  panini.refresh();
  done();
}

// Generate a style guide from Markdown content and HTML template
function styleGuide(done) {
  sherpa(
    "src/styleguide/index.md",
    {
      output: `${PATHS.dist}/styleguide.html`,
      template: "src/styleguide/template.html",
    },
    done
  );
}

// Compile Sass into CSS
function sassBuild() {
  const postCssPlugins = [
    autoprefixer(),
    // Uncomment the next line to remove unused styles in production
    // PRODUCTION && uncss(UNCSS_OPTIONS),
  ].filter(Boolean);

  return gulp
    .src("src/assets/scss/app.scss")
    .pipe(sourcemaps.init())
    .pipe(plumber())
    .pipe(
      sass({
        includePaths: PATHS.sass,
      }).on("error", sass.logError)
    )
    .pipe(postcss(postCssPlugins))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest(`${PATHS.dist}/assets/css`))
    .pipe(browserSync.reload({ stream: true }));
}

// JavaScript bundling with Webpack
const webpackConfig = {
  mode: PRODUCTION ? "production" : "development",
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
            compact: false,
          },
        },
      },
    ],
  },
  devtool: !PRODUCTION && "source-map",
};

function javascript() {
  return gulp
    .src(PATHS.entries)
    .pipe(named())
    .pipe($.sourcemaps.init())
    .pipe(webpackStream(webpackConfig, webpack2))
    .pipe(
      $.if(
        PRODUCTION,
        $.terser().on("error", (e) => {
          console.error(e);
        })
      )
    )
    .pipe($.if(!PRODUCTION, $.sourcemaps.write()))
    .pipe(gulp.dest(`${PATHS.dist}/assets/js`));
}

// Optimize and copy images to the "dist" folder
function images() {
  return gulp
    .src("src/assets/img/**/*")
    .pipe(
      $.if(
        PRODUCTION,
        imagemin([
          imagemin.gifsicle({ interlaced: true }),
          imagemin.mozjpeg({ quality: 85, progressive: true }),
          imagemin.optipng({ optimizationLevel: 5 }),
          imagemin.svgo({
            plugins: [{ removeViewBox: true }, { cleanupIDs: false }],
          }),
        ])
      )
    )
    .pipe(gulp.dest(`${PATHS.dist}/assets/img`));
}

// Start a server with BrowserSync
function server(done) {
  browserSync.init(
    {
      server: PATHS.dist,
      port: PORT,
    },
    done
  );
}

// Reload the browser with BrowserSync
function reload(done) {
  browserSync.reload();
  done();
}

// Watch for changes to static assets, pages, Sass, and JavaScript
function watch() {
  gulp.watch(PATHS.assets, copy);
  gulp.watch("src/pages/**/*.html").on("all", gulp.series(pages, reload));
  gulp
    .watch("src/{layouts,partials}/**/*.html")
    .on("all", gulp.series(resetPages, pages, reload));
  gulp
    .watch("src/data/**/*.{js,json,yml}")
    .on("all", gulp.series(resetPages, pages, reload));
  gulp
    .watch("src/helpers/**/*.js")
    .on("all", gulp.series(resetPages, pages, reload));
  gulp.watch("src/assets/scss/**/*.scss").on("all", sassBuild);
  gulp
    .watch("src/assets/js/**/*.js")
    .on("all", gulp.series(javascript, reload));
  gulp.watch("src/assets/img/**/*").on("all", gulp.series(images, reload));
  gulp.watch("src/styleguide/**").on("all", gulp.series(styleGuide, reload));
}
