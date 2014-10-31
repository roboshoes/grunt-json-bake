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

        // Merge user options with default options, without defaultIncludeFiles

        var options = this.options( {
            stripComments: false,
            indentation: "\t",
            parsePattern: /\{\{\s*([\/\.\-\w]*)\s*\}\}/,
            variables: {},
            variableRegex: /@(\w+)@/g
        } );

        var RESULTTYPE = {
            STRING: "string",
            JSON: "json"
        };

        var defaultIncludeFiles = {
            json: { resultType: RESULTTYPE.JSON},
            html: { resultType: RESULTTYPE.STRING, separator: ""  },
            csv: { resultType: RESULTTYPE.STRING, separator: ";"  }
        };

        // Merge user and default includeFiles
        // won't be needed in Grunt 0.5.0: https://github.com/gruntjs/grunt/issues/738

        if ( ! options.includeFiles ) {
            options.includeFiles = defaultIncludeFiles;

        } else {
            Object.keys( defaultIncludeFiles ).forEach( function( defaultFileExtension ) {
                var optionsFileExtObj = options.includeFiles[ defaultFileExtension ];
                if ( optionsFileExtObj ) {
                    var defFileExtObj = defaultIncludeFiles[ defaultFileExtension ];
                    Object.keys( defFileExtObj ).forEach( function( defaultFileExtensionObjectKey ) {
                        if ( ! optionsFileExtObj[ defaultFileExtensionObjectKey ] ) {
                            optionsFileExtObj[ defaultFileExtensionObjectKey ] = defaultIncludeFiles[ defaultFileExtension ][ defaultFileExtensionObjectKey ];
                        }
                    } );
                } else {
                    options.includeFiles[ defaultFileExtension ] = defaultIncludeFiles[ defaultFileExtension ];
                }
            } );
        }


        // Returns array of the file extensions of files that can be included

        function getIncludeFileExtensions() {
            return Object.keys( options.includeFiles );
        }


        // Returns the file extenstion or empty string if there is no extension

        function getFileExtension( path ) {

            if ( path.indexOf( "." ) > -1 ) {
                return path.split( "." ).pop();
            }

            return "";
        }


        // Returns true if source points to a file

        function checkFile( path ) {
            if ( typeof path === "undefined" || ! grunt.file.exists( path ) ) {
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


        // Returns true if the path given points at a JSON file or accepted include file

        function isIncludeFile( path ) {
            if ( fs.statSync( path ).isFile() &&
                getIncludeFileExtensions().indexOf( getFileExtension( path ) ) !== - 1 ) return true;

            return false;
        }


        // Returns true if the path points to a directory

        function isDirectory( path ) {
            return fs.statSync( path ).isDirectory();
        }


        function parseFile( path ) {

            var fileExtension = getFileExtension( path );

            if ( fileExtension ) {

                var extensionFound = false;
                var parsedResult = null;

                getIncludeFileExtensions().forEach( function( includeFileExt ) {
                    if ( ! extensionFound ) {

                        if ( fileExtension === includeFileExt ) {
                            extensionFound = true;

                            var content = grunt.file.read( path );
                            var resultType = options.includeFiles[ includeFileExt ][ "resultType" ];

                            if ( resultType === RESULTTYPE.JSON ) {

                                parsedResult = parseJSON( path, content );

                            } else if ( resultType === RESULTTYPE.STRING ) {

                                var separator = options.includeFiles[ includeFileExt ][ "separator" ];
                                parsedResult = parseString( content, separator );

                            }
                        }
                    }
                } );

                if ( ! extensionFound ) return undefined;
                else return parsedResult;
            }

            return undefined;
        }


        // Parses a JSON file and returns value as object

        function parseJSON( path, content ) {

            return JSON.parse( content, function( key, value ) {

                if ( options.stripComments && key === "{{comment}}" ) return undefined;

                // Replace variables in their values

                if ( Object.keys( options.variables ).length && typeof value === "string" ) {
                    value = replaceVariables( value );
                }

                var match = ( typeof value === "string" ) ? value.match( options.parsePattern ) : null;

                if ( match ) {
                    var folderPath = getFolder( path ) || ".";
                    var fullPath = folderPath + "/" + match[ 1 ];

                    return isDirectory( fullPath ) ? parseDirectory( fullPath ) : parseFile( fullPath );
                }

                return value;

            } );
        }


        // Replaces defined variables in the given value

        function replaceVariables( value ) {

            return value.replace( options.variableRegex, function( match, key ) {

                if ( ! options.variables[ key ] ) {
                    grunt.log.warn( "No variable definition found for: " + key );
                    return "";
                }

                return options.variables[ key ];
            } );

        }


        // Parses a text file and returns value as object

        function parseString( content, separator ) {
            return content.replace( /"/g, "\"" ).replace( /\n/g, separator );
        }


        // Parses a directory and returns content as array

        function parseDirectory( path ) {

            return fs.readdirSync( path )

                .map( function( file ) {

                    var filePath = path + "/" + file;

                    if ( isIncludeFile( filePath ) ) return parseFile( filePath );
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
