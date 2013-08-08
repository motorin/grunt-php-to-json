/*
 * grunt-php-to-json
 * https://github.com/motorin/grunt-php-to-json
 *
 * Copyright (c) 2013 Pavel Motorin
 * Licensed under the MIT license.
 */

'use strict';

// exec = require('child_process').exec;
var exec = require('child_process').exec,
    numCPUs = require('os').cpus().length;



module.exports = function(grunt) {

  // Link to Underscore.js
  var _ = grunt.util._;

  // Link to async
  var async = grunt.util.async;
  
  grunt.registerMultiTask('php_to_json', 'Convert PHP-array to JSON', function() {

    var oldTemplateSettings = _.templateSettings;
        // _.templateSettings = {
          // 'interpolate': /{{([\s\S]+?)}}/g
        // };

    // Tell grunt this task is asynchronous.
    var done = this.async();


    // init asynchronous flow
    var queue = async.queue(function (task, callback) {
      processPHPFile(task.file, function(err, result) {
        if(err) {
          done(false);
        } else {
          callback(result);
        }
      });
    }, 2);

    // done building callback
    queue.drain = function() {
        // _.templateSettings = oldTemplateSettings;
        done(true)
    };


    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      template: '<%= content %>',
      punctuation: '.',
      separator: ', '
    });


    // Iterate over all specified file groups.
    this.files.forEach(function(f) {

      // Concat specified files.
      var currentFilePath = f.src.filter(function(filepath) {
        // Warn on and remove invalid source files (if nonull was set).
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return false;
        } else {
          return filepath;
        }
      })
      // .map(function(filepath) {
      //   // Read file source.
      //   return grunt.file.read(filepath);
      // }).join(grunt.util.normalizelf(options.separator));

      // Handle options.
      // src += options.punctuation;
      if( currentFilePath){
        queue.push({file: currentFilePath}, function (result) {
            // save
            if( options.contentCallback ){
              grunt.file.write(f.dest, options.contentCallback(currentFilePath, result, options.contentOptions));
            } else {
              grunt.file.write(f.dest, result);
            }
            // Print a success message.
            grunt.log.writeln('File "' + f.dest + '" created.');
        });
      }

      // // Write the destination file.
      // grunt.file.write(f.dest, src);

    });
  });

  function processPHPFile(filepath, callback) {
      exec('php -r "echo json_encode(require(\''+ filepath + '\'));"', {maxBuffer: 32*1024*1024}, function(err, stdout, stderr) {
        if(err) {
          callback(err);
        } else {
          callback(null, JSON.parse(stdout));
        }
      });
  }

};
