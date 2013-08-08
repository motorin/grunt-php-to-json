/*
 * grunt-php-to-json
 * https://github.com/motorin/grunt-php-to-json
 *
 * Copyright (c) 2013 Pavel Motorin
 * Licensed under the MIT license.
 */

'use strict';
var path = require('path');

module.exports = function(grunt) {
  var _ = grunt.util._;

  var i18nProcess = function(filepath, content, contentOptions){
    var bundleName = path.basename(filepath).replace(new RegExp(path.extname(filepath) + '$'), '');
    var template = [
    'define(function() {',
    'return ((window.Inn = window.Inn || {}).i18n = window.Inn.i18n || {})['+ contentOptions.projectName + '/<%= filename %>] = <%= JSON.stringify(content) %>;',
    '});'
    ];
    return _.template( template.join(''), {filename: bundleName, content: content});
  }


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
      i18n_4game: {
        options: {
          contentOptions: {
            projectName: "4game.com" 
          },
          contentCallback: i18nProcess
        },
        expand: true,
        cwd: process.env['INN_I18N_PATH'],
        src: ['lang/*/4game.com/**/*.php','!lang/*/4game.com/**/summary.php'],
        dest: 'tmp/i18n',
        ext: ".js"
      },
      i18n_inn: {
        options: {
          contentOptions: {
            projectName: "inn" 
          },
          contentCallback: i18nProcess
        },
        expand: true,
        cwd: process.env['INN_I18N_PATH'],
        src: ['lang/*/inn/**/*.php','!lang/*/inn/**/summary.php'],
        dest: 'tmp/i18n',
        ext: ".js"
      }
      // custom_options: {
      //   options: {,'lang/*/inn/**/*.php'
      //     separator: ': ',
      //     punctuation: ' !!!',
      //   },
      //   files: {
      //     'tmp/custom_options': ['test/fixtures/testing', 'test/fixtures/123'],
      //   },
      // },
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
