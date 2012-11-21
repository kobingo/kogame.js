/*global module:false*/
module.exports = function(grunt) {

  var _src = [
    '<banner:meta.banner>', 
    'src/game.js', 
    'src/keyboard.js', 
    'src/mouse.js', 
    'src/graphics.js', 
    'src/node.js', 
    'src/sprite.js',
    'src/label.js', 
    'src/collision.js',
    'src/action.js', 
    'src/sequence.js', 
    'src/director.js',
    'src/scene.js', 
    'src/transition.js',
    'src/popup.js', 
    'src/menu.js'
  ];

  // Project configuration.
  grunt.initConfig({
    pkg: '<json:package.json>',
    meta: {
      banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '<%= pkg.homepage ? "* " + pkg.homepage + "\n" : "" %>' +
        '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
        ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */'
    },
    lint: {
      files: ['grunt.js', 'src/**/*.js', 'test/**/*.js']
    },
    concat: {
      dist: {
        src: _src,
        dest: '<%= pkg.name %>-<%= pkg.version %>.js'
      },
      exam: {
        src: _src,
        dest: 'examples/js/<%= pkg.name %>-<%= pkg.version %>.js'
      }
    },
    qunit: {
      files: ['test/**/*.html']
    },
    min: {
      dist: {
        src: ['<banner:meta.banner>', '<config:concat.dist.dest>'],
        dest: '<%= pkg.name %>-<%= pkg.version %>.min.js'
      }
    },
    watch: {
      files: '<config:lint.files>',
      tasks: 'lint concat qunit'
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true
      },
      globals: {}
    },
    uglify: {}
  });

  // Default task.
  grunt.registerTask('default', 'lint concat qunit min');

};
