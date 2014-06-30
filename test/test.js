"use strict";

var mout = require( "mout" );
var grunt = require( "grunt" );

exports.bake = {

    run: function( test ) {

        var files = {
            "tmp/simple_bake.json": "test/expected/simple_bake.json",
            "tmp/nested_bake.json": "test/expected/nested_bake.json",
            "tmp/nested_folder_bake.json": "test/expected/nested_folder_bake.json",
            "tmp/comment_bake.json": "test/expected/comment_bake.json"
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
