module.exports = function(grunt) {
	var scriptFile = grunt.option("script") || "test-data-transform.js";
	var dataFile = grunt.option("data") || "test-data.json";

	grunt.initConfig({
		pkg: grunt.file.readJSON("package.json"),

		nodemon: {
			dev: {
				script: "app.js",
				options: {
					args: [ scriptFile, dataFile ],
					ignoredFiles: [ "client/**", "node_modules/**", "public/**" ],
					watchedExtensions: [ "js" ],
					env: {
						PORT: "3000"
					},
					cwd: __dirname
				}
			}
		},

		watch: {
			less: {
				files: [ "public/*.less" ],
				tasks: [ "less" ]
			},
			js: {
				files: [ "client/**" ],
				tasks: [ "browserify" ]
			}
		},

		less: {
			development: {
				options: {
					paths: [ "public" ]
				},
				files: {
					"public/style.css": "public/style.less"
				}
			}
		},

		browserify: {
			"public/main.js": [ "client/main.js" ]
		},

		concurrent: {
			dev: {
				tasks: [ "nodemon", "watch" ],
				options: {
					logConcurrentOutput: true
				}
			}
		}
	});

	// load libs
	grunt.loadNpmTasks("grunt-contrib-less");
	grunt.loadNpmTasks("grunt-contrib-watch");
	grunt.loadNpmTasks("grunt-browserify");
	grunt.loadNpmTasks("grunt-concurrent");
	grunt.loadNpmTasks("grunt-nodemon");

	// run task
	grunt.registerTask("run", [ "concurrent" ]);

	// default task
	grunt.registerTask("default", [ "browserify", "less", "run" ]);
};
