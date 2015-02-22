var argv = require("yargs").argv;
var browserify = require("browserify");
var browsersync = require("browser-sync");
var chalk = require("chalk");
//var chmod = require("gulp-chmod");
var gulp = require("gulp");
//var jslint = require("gulp-jslint");
var less = require("gulp-less");
var log = require("gulp-util").log;
var source = require("vinyl-source-stream");
var watchify = require("watchify");

var error = function(error) {
  log(chalk.red(error.message));
  this.emit("end");
};

var bundle = function(options) {
  var runWatchify = options ? options.watchify : false;

  var filePath = "./src/app.js";
  var fileName = "app.web.js";
  var fileDest = "./";

  var bundler = browserify({
    entries: [ filePath ],
    fullPaths: true,
    debug: false,
    cache: {},
    packageCache: {}
  });

  if (runWatchify) {
    bundler = watchify(bundler);
  }

  //bundler
    //.transform("browserify-shim")

  bundler.on("log", function(data) {
    var logString = data.split(" ").map(function(word) {
      word = word.replace(/\(|\)/g, "");
      return !isNaN(word) ? chalk.magenta(word) : word;
    }).join(" ");

    log(chalk.cyan("browserify") + " " + logString);
  });

  var rebundle = function() {
    return bundler
      .bundle()
      .on("error", error)
      .pipe(source(fileName))
      //.pipe(chmod(644))
      .pipe(gulp.dest(fileDest));
  };

  if (runWatchify) {
    bundler.on("update", rebundle);
  }

  return rebundle();
};

var compile = function() {
  var lesser = less().on("error", error);

  var filePath = "./style/style.less";
  var fileDest = "./";

  return gulp.src(filePath)
    .pipe(lesser)
    .pipe(gulp.dest(fileDest));
};

//var lint = function() {
//  return gulp.src([ "*.js", "./src/**/*.js", "!./app.web.js", "!./src/libs/*.js" ])
//    .pipe(jslint({
//      errorsOnly: true,
//      newcap: true,
//      node: true,
//      nomen: true,
//      sloppy: true,
//      unparam: true,
//      vars: true,
//      white: true,
//      plusplus: true
//    }))
//    .on("error", error);
//};

var server = function() {
  return browsersync.init({
    server: { baseDir: "./" },
    files: [ "app.web.js", "style.css", "index.html" ],
    port: argv.port || 3000,
    open: false
  });
};

gulp.task("browserify", function() { return bundle();                   });
gulp.task("watchify",   function() { return bundle({ watchify: true }); });
gulp.task("less",       function() { return compile();                  });
//gulp.task("lint",       function() { return lint();                     });
gulp.task("server",     function() { return server();                   });

gulp.task("watch", function() {
  gulp.watch("./style/*.less", function() { gulp.start("less"); });
});

gulp.task("default", [ /*"lint",*/ "less", "watchify", "watch", "server" ]);
gulp.task("dist",    [ "browserify", "less" ]);

