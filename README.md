# grunt-php-to-json

> Convert PHP-array files to JSON-files

## Getting Started
This plugin requires Grunt `~0.4.1`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-php-to-json --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-php-to-json');
```

## The "php_to_json" task

### Overview
In your project's Gruntfile, add a section named `php_to_json` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  php_to_json: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
})
```

### Options

#### options.wrapper
Type: 'String'
Default value: `undefined`

If present then content will have been wrapped with callback function with this name. It's common task for cross-domain AJAX-requests. 
Please, notice that `options.contentProcess` will not be working with `options.wrapper`.

#### options.contentProcess
Type: `Function`
Parameters: function(filepath, content, contentOptions){…}

A function for processing result content before writing it to file.
Useful for attaching custom templates.

#### options.contentOptions
Type: `Any`
Default value: `undefined`

Custom data that just passed to `contentCallback`.

### Usage Examples

#### Default Options
In this example, the default options are used to do something with whatever. So if the `testing` file has the content `Testing` and the `123` file had the content `1 2 3`, the generated result would be `Testing, 1 2 3.`

```js
grunt.initConfig({
  php_to_json: {
    options: {},
    files: {
      'dest/default_options': ['src/testing', 'src/123'],
    },
  },
})
```

#### Custom Options
In this example, custom options are used to do something else with whatever else. So if the `testing` file has the content `Testing` and the `123` file had the content `1 2 3`, the generated result in this case would be `Testing: 1 2 3 !!!`

```js
grunt.initConfig({
  php_to_json: {
    options: {
      contentOptions: {
          title: "New title",
      },
      contentCallback: function(filepath, content, contentOptions) {
      
      }
    },
    files: {
      'dest/default_options': ['src/testing', 'src/123'],
    },
  },
})
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_
