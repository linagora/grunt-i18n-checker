const checker = require('i18n-checker');
const fs = require('fs');
const path = require('path');

const reporter = checker.reporters.standard;

const MODULES_DIR = 'modules';

module.exports = function(grunt) {
  grunt.registerMultiTask('i18n_checker', 'Grunt plugin for i18n-checker', function() {
    const done = this.async();
    const options = this.options();
    const taskOptions = buildTaskOption(options);

    try {
      checker(taskOptions, (err, result) => {
        if (err) {
          return done(err);
        }

        const report = reporter(result);
        const message = `${report.error} error(s). ${report.warning} warning(s).`;

        if (report.error) {
          grunt.fail.warn(message);
        } else if (report.warning) {
          grunt.log.writeln(message);
        }

        done();
      });
    } catch (err) {
      console.error(err);
      done(new Error('Uncaught exception while running task'));
    }
  });
};

function buildTaskOption(options) {
  const { verifyOptions } = options;
  const baseDir = path.normalize(options.baseDir);

  const awesomeModuleLocaleDirs = findModuleDirs(baseDir)
    .map(moduleDir => ({
      localeDir: path.join(moduleDir, 'backend/lib/i18n/locales'),
      templateSrc: path.join(moduleDir, 'frontend/**/*.jade')
    }))
    .filter(dir => isDirectory(baseDir, dir.localeDir));

  const dirs = [{
    localeDir: 'backend/i18n/locales',
    templateSrc: [
      'frontend/views/**/*.jade',
      'frontend/js/**/*.jade'
    ],
    core: true
  },
    ...awesomeModuleLocaleDirs
  ];

  return {
    baseDir,
    dirs,
    verifyOptions
  };
}

function findModuleDirs(baseDir) {
  const dirs = fs.readdirSync(path.join(baseDir, MODULES_DIR));

  return dirs.map(dir => path.join(MODULES_DIR, dir));
}

function isDirectory(baseDir, dirPath) {
  try {
    const stat = fs.statSync(path.join(baseDir, dirPath));

    return stat.isDirectory();
  } catch (err) {
    return false;
  }
}
