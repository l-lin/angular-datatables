module.exports = function (wallaby) {
  return {
    files: [
      { pattern: 'test/setup/*', instrument: false },
      { pattern: 'src/**/*.scss', instrument: false },
      'src/**/*.+(ts|tsx)',
      '!src/**/*-spec.+(ts|tsx)',
    ],

    tests: [
      'src/**/*-spec.+(ts|tsx)'
    ],

    compilers: {
      '**/*.+(ts|tsx)': wallaby.compilers.typeScript()
    },

    testFramework: 'mocha',

    env: {
      type: 'node',

      params: {
        env: 'NODE_ENV=test'
      }
    },

    setup: function (wallaby) {
      require('./test/setup/setup-dom');
      require('./test/setup/setup-mocha');
      require('./test/setup/setup-mobx');

      const mocha = wallaby.testFramework;
      const sandboxSetup = require('./test/setup/setup-sandbox');
      mocha.suite.beforeEach(sandboxSetup._beforeEach);
      mocha.suite.afterEach(sandboxSetup._afterEach);
    }
  }
};
