# grunt-json-bake [![Build Status](https://travis-ci.org/MathiasPaumgarten/grunt-json-bake.png?branch=master)](https://travis-ci.org/MathiasPaumgarten/grunt-json-bake)

> Baking multiple json files into one

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-json-bake --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-json-bake');
```

## The "json_bake" task

### Overview
This module allows you to merge multiple JSON files into one. I looks for a certain hooks like so `"key": "{{path/to/folder}}"`.
All values are parsed and replaced. If the hook is a path to a JSON file, the hook will be replaced with the JSON file content.
If the hook is the path to a folder it will take all the JSON files in this folder and put them into an array.

Includes can be nested. That means any JSON that you include will be recursively parsed a swell. Also folders of JSON files can be nested. When
a folder is turned into an array it parses the content of a folder for json files. If it comes upon an folder, this will be turned into an array
and recursivly all the content will be travirsed for JSON files/folders.

```js
grunt.initConfig( {
    json_bake: {

        your_target: {
            // multiple files in a key value pair
            // the key is the destination and
            // the value is the root of the parsable

            "dist/final.json": "app/base.json"
        }
    }
} );
```

### Options

#### options.parsePattern
Type: `Regex`
Default value: `/\{\{\s*([\/\.\-\w]*)\s*\}\}/`

This Regex is used to parse every value of all key-value-pairs. If the value has a formet like `{{path/to/something}}` it is resolved and parsed as well.
The path is relative to that file and can point to a folder or a file.

#### options.stripComments
Type: `Boolean`
Default value: `false`

If this is set to `true` it will remove every key-value pair that has the key `"{{comment}}"`.

### Usage Examples

#### Recursive Bake including files and folders

Given the following folder structure:

```
base.json
includes
  | - author.json
  \ - books
        | - 1.json
        | - 2.json
        \ - 3.json
```

This is the `base.json`:
```json
{
    "author": "{{includes/author.json}}",
    "books": "{{includes/books}}"
}
```

With an `includes/author.json`:

```json
{
    "name": "Mathias Paumgarten",
    "url": "http://www.mathias-paumgarten.com"
}
```

and three files in `includes/books/*` like so:

```json
{
    "name": "awesome book",
    "released": "2014"
}
```

This would generate a new json from `base.json`:

```json
{
    "author": {
        "name": "Mathias Paumgarten",
        "url": "http://www.mathias-paumgarten.com"
    },
    "books": [
        {
            "name": "awesome book",
            "released": "2014"
        },
        { ... },
        { ... }
    ]
}
```

`"books"` will be an array of the content of each of the JSON files in the book folder.

#### Removing comment lines

Make sure to turn it on in the `Gruntfile.js`:

```js
grunt.initConfig( {
    json_bake: {
        options: {
            stripComments: true
        },

        your_target: {
            // multiple files in a key value pair
            // the key is the destination and
            // the value is the root of the parsable

            "generated.json": "base.json"
        }
    }
} );
```

In your _base.json_ you can now add comments like so:

```json
{
    "{{comment}}": "This is a list of people",
    "authors": [ "John", "Mike", "Susan" ]
}
```

This will generate _generated.json_:
```json
{
    "authors": [ "John", "Mike", "Susan" ]
}
```

## Contributing
In lieu of a formal style guide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).
