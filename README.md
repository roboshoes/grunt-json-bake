# grunt-json-bake

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
All values are parsed and replaced. if the hook is a path to a JSON file, the hook will be replaced with the JSON file content.
If the hook is the path to a folder it will take all the JSON files in this folder and put them into an array.

Includes can be nested. That means any JSON that you include will be recursively parsed a swell.

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

### Usage Examples

This is a simple explanation


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

## Contributing
In lieu of a formal style guide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_
