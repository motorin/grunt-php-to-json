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

    // Tell grunt this task is asynchronous.
    var done = this.async();
    var filesProceed = 0;


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
        grunt.log.ok("Files successfuly converted: " + filesProceed);
        // _.templateSettings = oldTemplateSettings;
        done(true)
    };


    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      wrapper: null
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
      });

      if( currentFilePath){
        queue.push({file: currentFilePath}, function (result) {
            // Write the destination file.
            if( options.wrapper ){
              grunt.file.write(f.dest, options.wrapper + '(' + JSON.stringify(result) + ');');
            } else if( options.contentProcess ){
              // With content postProcess
              grunt.file.write(f.dest, options.contentProcess(currentFilePath, result, options.contentOptions));
            } else {
              // Without content postProcess
              grunt.file.write(f.dest, JSON.stringify(result));
            }
            filesProceed++;
            // Print a success message.
            // grunt.verbose.writeln('File converted: ' + currentFilePath + ' -> ' + f.dest);
        });
      }

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
