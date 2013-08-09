# grunt-php-to-json

> Convert PHP-array files to JSON-files

## Getting Started
This plugin requires Grunt `~0.4.1` and PHP installed on machine, cause it uses php native `json_encode` function.

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-php-to-json --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-php-to-json');
```

## PHP-array to JSON task

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
In this example, the default options are used to convert files. So it means that target files will contains just pure json-string in them.

```js
grunt.initConfig({
  php_to_json: {
      defaultOptions: {
        expand: true,
        cwd: "secretService/topSecretData/",
        src: ['*.php'],
        dest: 'publicData/',
        ext: ".js"
      }
  }
})
```

#### With Callback Wrapper name
In this example, option 'wrapper' is used to convert the file. So the target file will contain jsonp-friendly data. It means that pure json-string will be wrapped with custom function call. [More about JSONP](http://en.wikipedia.org/wiki/JSONP).

```js
grunt.initConfig({
  php_to_json: {
      withWrapper: {
        options: {
          wrapper: "justCallbackForCrossDomainAjax"
        },
        files: {
          'publicData/data.js': 'secretService/topSecretData/data.php'
        }
      },
  },
})
```

#### With Content Post-Process
In this example, options `contentProcess` and `contentOptions` are used to convert the file. So the target file will contain jsonp-friendly data. It means that pure json-string will be wrapped with custom function call. [More about JSONP](http://en.wikipedia.org/wiki/JSONP).

```js
grunt.initConfig({
  php_to_json: {
      withWrapper: {
        options: {
            contentOptions: {
                projectName: "SecretsToPublic",
                whatever: "whenever"
            },
            contentProcess: function(filepath, content, contentOptions){
                var path = require('path');
                var _ = grunt.util._;
                var bundlePrefix = contentOptions.projectName;
                var bundleName = path.basename(filepath).replace(new                 RegExp(path.extname(filepath) + '$'), '');
                var template = ['',
                    'define("<%= bundlePrefix %>/<%= bundleName %>", function(){',
                    'return <%= JSON.stringify(content) %>'
                    '});'
                })']
                return _.template(template.join(''), {
                    bundleName: bundleName,
                    bundlePrefix: bundlePrefix,
                    content: content
                });
            }
        },
        files: {
          'publicData/data.js': 'secretService/topSecretData/data.php'
        }
      },
  },
})
```

## Logging
Basically it has just files counter to log out. If you want to see which files exactly process, just run grunt in verbose mode: `grunt -v`.

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_
