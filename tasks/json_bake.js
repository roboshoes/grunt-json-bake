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

    var regex = /\"\{\{\s*([\/\.\-\w]*)\s*\}\}\"/g;

    grunt.registerMultiTask( "json_bake", "Baking multiple json files into one", function() {

        function checkFile( src ) {
            if ( ! grunt.file.exists( src ) ) {
                grunt.log.error( "Source file \"" + src + "\" not found." );
                return false;
            }

            return true;
        }

        function getFolder( path ) {
            var segments = path.split( "/" );

            segments.pop();

            return segments.join( "/" );
        }

        function formatJSON( content ) {
            try {

                return JSON.stringify( JSON.parse( content ), null, "\t" );

            } catch( error ) {

                grunt.log.error( error );
                return false;

            }
        }

        function parse( path ) {
            var content = grunt.file.read( path );
            var folderPath = getFolder( path );

            return content.replace( regex, function( match, target ) {

                var fullPath = folderPath + "/" + target;
                var isDirectory = fs.statSync( fullPath ).isDirectory();

                if ( isDirectory ) {

                    var files = fs.readdirSync( fullPath );
                    var parsedFiles = [];

                    files.forEach( function( file ) {

                        var filePath = fullPath + "/" + file;

                        if ( ! fs.statSync( filePath ).isFile() ) return;

                        parsedFiles.push( parse( filePath ) );

                    } );

                    return "[" + parsedFiles.join( "," ) + "]";

                } else {

                    return parse( fullPath );

                }
            } );
        }

        this.files.forEach( function( file ) {

            var src = file.src[ 0 ];
            var dest = file.dest;

            if ( ! checkFile( src ) ) return;

            var destContent = formatJSON( parse( src ) );

            if ( destContent === false ) {
                grunt.log.error( "Could not write file \"" + dest + "\" because of JSON error." );
                return;
            }

            grunt.file.write( dest, destContent );
            grunt.log.ok( "File \"" + dest + "\" created." );

        } );

    } );

};
