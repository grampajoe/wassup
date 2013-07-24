module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-mocha-test');

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    mochaTest: {
      unit: {
        options: {
          reporter: 'spec',
        },
        src: ['test/unit/**/*.js'],
      },
      functional: {
        options: {
          reporter: 'spec',
        },
        src: ['test/functional/**/*.js'],
      },
    },
  });

  grunt.registerTask('default', 'mochaTest');
};
