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

        var options = this.options( {
            parsePattern: /\"\{\{\s*([\/\.\-\w]*)\s*\}\}\"/g
        } );

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

        function isJSONFile( path ) {
            if ( fs.statSync( path ).isFile() &&
                path.split( "." ).pop().toLowerCase() === "json") return true;

            return false;
        }

        function isDirectory( path ) {
            return fs.statSync( path ).isDirectory();
        }

        function formatJSON( content ) {
            try {

                return JSON.stringify( JSON.parse( content ), null, "\t" );

            } catch( error ) {

                grunt.log.error( error );
                return null;

            }
        }

        function parse( path ) {
            var content = grunt.file.read( path );
            var folderPath = getFolder( path );

            return content.replace( options.parsePattern, function( match, target ) {

                var fullPath = folderPath + "/" + target;

                if ( isDirectory( fullPath ) ) {

                    return resolveDirectory( fullPath );

                } else {

                    return parse( fullPath );

                }
            } );
        }

        function resolveDirectory( path ) {
            var files = fs.readdirSync( path );

            return "[" + files

                .map( function( file ) {

                    var filePath = path + "/" + file;

                    if ( isJSONFile( filePath ) ) return parse( filePath );
                    else if ( isDirectory( filePath ) ) return resolveDirectory( filePath );

                    return null;
                } )

                .filter( function( value ) {

                    return value !== null;

                } )

                .join( "," ) + "]";
        }

        this.files.forEach( function( file ) {

            var src = file.src[ 0 ];
            var dest = file.dest;

            if ( ! checkFile( src ) ) return;

            var destContent = formatJSON( parse( src ) );

            if ( destContent === null ) {
                grunt.log.error( "Could not write file \"" + dest + "\" because of JSON error." );
                return;
            }

            grunt.file.write( dest, destContent );
            grunt.log.ok( "File \"" + dest + "\" created." );

        } );

    } );

};
