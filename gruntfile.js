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
					ignoredFiles: [ "clien/**", "node_modules/**" ],
					watchedExtensions: [ "js" ],
					env: {
						PORT: "3000"
					},
					cwd: __dirname
				}
			}
		},

		watch: {
			files: [ "public/**" ],
			tasks: [ "less" ]
		},

		less: {
			development: {
				options: {
					paths: [ "public/", "node_modules/bootstrap/less" ]
				},
				files: {
					"public/style.css": "public/style.less"
				}
			}
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
	grunt.loadNpmTasks("grunt-concurrent");
	grunt.loadNpmTasks("grunt-nodemon");

	// run task
	grunt.registerTask("run", [ "concurrent" ]);

	// default task
	grunt.registerTask("default", [ "less", "run" ]);
};
