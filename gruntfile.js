module.exports = function(grunt) {
	var scriptFile = grunt.option("script") || "example_data/test-data-transform.js";
	var dataFile = grunt.option("data") || "example_data/test-data.json";

	grunt.initConfig({
		pkg: grunt.file.readJSON("package.json"),

		nodemon: {
			dev: {
				script: "app.js",
				options: {
					args: [ scriptFile, dataFile ],
					ignore: [ "client/**", "node_modules/**", "public/**", scriptFile, dataFile  ],
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
			client: {
				dest: "public/main.js",
				src: [ "client/app.js" ],
				options: {
					watch: true,
					keepAlive: true
				}
			}
		},

		concurrent: {
			dev: {
				tasks: [ "nodemon", "watch", "browserify" ],
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
	grunt.registerTask("default", [ "less", "run" ]);
};
