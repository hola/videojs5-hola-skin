'use strict';

module.exports = function(grunt) {
  let pkg = grunt.file.readJSON('package.json');
  let version = pkg.version;

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    watch: {
      js: {
        files: ['src/**/*.js', 'Gruntfile.js'],
        tasks: ['jshint']
      }
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: ['src/**/*.js']
    },
    less: {
      options: {
        paths: ['src/css/']
      },
      all: {
        files: [
          {
            nonull: true,
            dest: 'dist/css/videojs-hola-skin.css',
            src: ['src/**/*.less']
          }
        ]
      }
    },
    concat: {
      dist: {
        src: ['src/**/*.js'],
        dest: 'dist/js/videojs-hola-skin.js'
      }
    },
    version: {
      options: {
        prefix: '',
        replace: '\\{\\[version\\]\\}'
      },
      src: ['dist/js/videojs-hola-skin.js']
    },
    uglify : {
      all : {
        files: {
          'dist/js/videojs-hola-skin.min.js' : [
            'dist/js/videojs-hola-skin.js'
          ]
        }
      }
    },
    clean: ['dist'],
  });

  // Load Grunt tasks.
  require('load-grunt-tasks')(grunt);

  grunt.registerTask('build', ['clean', 'jshint', 'less',
      'concat', 'version', 'uglify']);
  // Default task.
  grunt.registerTask('default', ['build']);

};
