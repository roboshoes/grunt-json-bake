/*
 * grunt-json-bake
 *
 *
 * Copyright (c) 2014 Mathias Paumgarten
 * Licensed under the MIT license.
 */

"use strict";

var fs = require( "fs" );

module.exports = function( grunt ) {

    grunt.registerMultiTask( "json_bake", "Baking multiple json files into one", function() {

        // Merge user options with default options

        var options = this.options( {
            stripComments: false,
            indentation: "\t",
            parsePattern: /\{\{\s*([\/\.\-\w]*)\s*\}\}/
        } );


        // Returns true if source points to a file

        function checkFile( path ) {
            if ( ! grunt.file.exists( path ) ) {
                grunt.log.error( "Source file \"" + path + "\" not found." );
                return false;
            }

            return true;
        }


        // Helper to retrieve the folder path of a file path

        function getFolder( path ) {
            var segments = path.split( "/" );

            segments.pop();

            return segments.join( "/" );
        }


        // Returns true if the path given points at a JSON file

        function isJSONFile( path ) {
            if ( fs.statSync( path ).isFile() &&
                path.split( "." ).pop().toLowerCase() === "json") return true;

            return false;
        }


        // Returns true if the path points to a directory

        function isDirectory( path ) {
            return fs.statSync( path ).isDirectory();
        }


        // Parses a JSON file and returns value as object

        function parseFile( path ) {
            var folderPath = getFolder( path ) || ".";
            var content = grunt.file.read( path );

            return JSON.parse( content, function( key, value ) {

                if ( options.stripComments && key === "{{comment}}" ) return undefined;

                var match = ( typeof value === "string" ) ? value.match( options.parsePattern ) : null;

                if ( match ) {
                    var fullPath = folderPath + "/" + match[ 1 ];

                    return isDirectory( fullPath ) ? parseDirectory( fullPath ) : parseFile( fullPath );
                }

                return value;

            } );

        }


        // Parses a directory and returns content as array

        function parseDirectory( path ) {

            return fs.readdirSync( path )

                .map( function( file ) {

                    var filePath = path + "/" + file;

                    if ( isJSONFile( filePath ) ) return parseFile( filePath );
                    else if ( isDirectory( filePath ) ) return parseDirectory( filePath );

                    return null;
                } )

                .filter( function( value ) {

                    return value !== null;

                } );
        }


        // Loop over all files given in config and parse them

        this.files.forEach( function( file ) {

            var src = file.src[ 0 ];
            var dest = file.dest;

            if ( ! checkFile( src ) ) return;

            var destContent = JSON.stringify( parseFile( src ), null, options.indentation );

            grunt.file.write( dest, destContent );
            grunt.log.ok( "File \"" + dest + "\" created." );

        } );

    } );

};
