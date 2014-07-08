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
            }
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
