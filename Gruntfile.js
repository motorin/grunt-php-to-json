/*
 * grunt-php-to-json
 * https://github.com/motorin/grunt-php-to-json
 *
 * Copyright (c) 2013 Pavel Motorin
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>',
      ],
      options: {
        jshintrc: '.jshintrc',
      },
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp'],
    },

    // Configuration to be run (and then tested).
    php_to_json: {
      defaultOptions: {
        expand: true,
        cwd: "test/fixtures",
        src: ['data.php'],
        dest: 'tmp/',
        ext: ".js"
      },
      withWrapper: {
        options: {
          wrapper: "someFunc"
        },
        files: {
          'tmp/withWrapper.js': 'test/fixtures/data.php'
        }
      },
      withContentProcess: {
        options: {
          contentOptions: {
            projectName: "MyLovelyProject"
          },
          contentProcess: function(filepath, content, contentOptions){
            var path = require('path');
            var _ = grunt.util._;
            var bundleName = path.basename(filepath).replace(new RegExp(path.extname(filepath) + '$'), '');
            grunt.log.writeln(contentOptions.projectName);
            var template = [
            'define("<%= bundlePrefix %>/<%= bundleName %>", function() {',
            'return <%= JSON.stringify(content) %>;',
            '});'
            ];
            return _.template( template.join(''), {bundleName: bundleName, bundlePrefix: contentOptions.projectName, content: content});
          }
        },
        files: {
          'tmp/withContentProcess.js': 'test/fixtures/data.php'
        }
      }
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js'],
    },

  });


  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'php_to_json', 'nodeunit']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};
