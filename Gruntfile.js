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
      integration: {
        options: {
          reporter: 'spec',
        },
        src: ['test/integration/**/*.js'],
      },
      functional: {
        options: {
          reporter: 'spec',
          timeout: 20000,
        },
        src: ['test/functional/**/*.js'],
      },
    },
  });

  grunt.registerTask('default', 'mochaTest');
};
