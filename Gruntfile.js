/*
 * grunt-json-bake
 *
 *
 * Copyright (c) 2014 Mathias Paumgarten
 * Licensed under the MIT license.
 */

"use strict";

module.exports = function( grunt ) {

    grunt.initConfig( {
        jshint: {
            all: [
                "Gruntfile.js",
                "tasks/*.js",
                "<%= nodeunit.tests %>"
            ],
            options: {
                jshintrc: ".jshintrc"
            }
        },

        clean: {
            tests: [ "tmp" ]
        },

        json_bake: {
            bake: {
                files: {
                    "tmp/simple_bake.json": "test/fixtures/simple_bake.json",
                    "tmp/nested_bake.json": "test/fixtures/nested_bake.json",
                    "tmp/nested_folder_bake.json": "test/fixtures/nested_folder_bake.json"
                }
            },

            bakeHtml: {
                files: {
                    "tmp/simple_html_bake.json": "test/fixtures/simple_html_bake.json",
                    "tmp/simple_html_multiline_bake.json": "test/fixtures/simple_html_multiline_bake.json",
                    "tmp/nested_html_bake.json": "test/fixtures/nested_html_bake.json"
                }
            },

            bakeHtmlSeparator: {
                options: {
                    includeFiles: {
                        html: { separator: "__"  }
                    }
                },
                files: {
                    "tmp/simple_html_multiline_separator_bake.json": "test/fixtures/simple_html_multiline_bake.json"
                }
            },

            comment: {
                options: {
                    stripComments: true
                },

                files: {
                    "tmp/comment_bake.json": "test/fixtures/comment_bake.json"
                }
            },

            minified: {
                options: {
                    indentation: null
                },

                files: {
                    "tmp/minified.json": "test/fixtures/simple_bake.json"
                }
            },

            small_intention: {
                options: {
                    indentation: "  "
                },

                files: {
                    "tmp/small_indentation.json": "test/fixtures/simple_bake.json"
                }
            },

            variables_1: {
                options: {
                    variables: {
                        folder: "folder",
                        num: 1
                    }
                },

                files: {
                    "tmp/variables1.json": "test/fixtures/variables.json"
                }
            },

            variables_2: {
                options: {
                    variables: {
                        folder: "folder",
                        num: 2
                    }
                },

                files: {
                    "tmp/variables2.json": "test/fixtures/variables.json"
                }
            },
        },

        nodeunit: {
            tests: [ "test/test.js" ]
        },

        watch: {
            jshint: {
                files: [ "tasks/**/*.js" ],
                tasks: [ "jshint", "test" ]
            }
        }

    } );

    grunt.loadTasks( "tasks" );

    grunt.loadNpmTasks( "grunt-contrib-jshint" );
    grunt.loadNpmTasks( "grunt-contrib-clean" );
    grunt.loadNpmTasks( "grunt-contrib-nodeunit" );
    grunt.loadNpmTasks( "grunt-contrib-watch" );

    grunt.registerTask( "test", [ "clean", "json_bake", "nodeunit" ] );
    grunt.registerTask( "default", [ "jshint", "test" ] );

};
