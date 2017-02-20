const loadGrunt = require('load-grunt-tasks');

module.exports = function(grunt) {
  grunt.initConfig({
    eslint: {
      options: {
        configFile: '.eslintrc.json'
      },
      target: [
        'Gruntfile.js',
        'src/**/*.js'
      ]
    }
  });

  loadGrunt(grunt);

  grunt.registerTask('default', ['lint']);
  grunt.registerTask('lint', 'eslint');
};
