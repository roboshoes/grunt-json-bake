"use strict";

var mout = require( "mout" );
var grunt = require( "grunt" );

exports.bake = {

    run: function( test ) {

        var files = {
            "tmp/simple_bake.json": "test/expected/simple_bake.json",
            "tmp/nested_bake.json": "test/expected/nested_bake.json",
            "tmp/nested_folder_bake.json": "test/expected/nested_folder_bake.json",
            "tmp/comment_bake.json": "test/expected/comment_bake.json",
            "tmp/minified.json": "test/expected/minified.json",
            "tmp/small_indentation.json": "test/expected/small_indentation.json",
            "tmp/simple_html_bake.json": "test/expected/simple_html_bake.json",
            "tmp/simple_html_multiline_bake.json": "test/expected/simple_html_multiline_bake.json",
            "tmp/simple_html_multiline_separator_bake.json": "test/expected/simple_html_multiline_separator_bake.json",
            "tmp/nested_html_bake.json": "test/expected/nested_html_bake.json",
            "tmp/variables1.json": "test/expected/variables1.json",
            "tmp/variables2.json": "test/expected/variables2.json"
        };

        test.expect( mout.object.size( files ) );

        mout.object.forOwn( files, function( value, key ) {
            var name = key.split( "/" )[ 1 ];
            var actual = grunt.file.read( key );
            var expected = grunt.file.read( value );

            test.equal( actual, expected, name );
        } );

        test.done();
    }
};
