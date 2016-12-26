'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Fixture = exports.defaultFixturesDir = exports.defaultOutputDir = exports.expect = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.createConfig = createConfig;
exports.chroot = chroot;
exports.expectSource = expectSource;
exports.fixturePath = fixturePath;
exports.readFixture = readFixture;
exports.writeFixture = writeFixture;
exports.touchFile = touchFile;
exports.outputFileName = outputFileName;
exports.readOutputFile = readOutputFile;
exports.cleanOutputDir = cleanOutputDir;
exports.cleanAndCompile = cleanAndCompile;
exports.compile = compile;
exports.watch = watch;

var _path = require('path');

var path = _interopRequireWildcard(_path);

var _fs = require('fs');

var fs = _interopRequireWildcard(_fs);

var _lodash = require('lodash');

var _ = _interopRequireWildcard(_lodash);

var _chai = require('chai');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/// <reference path="../defines.d.ts" />
var __awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }
        function rejected(value) {
            try {
                step(generator.throw(value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : new P(function (resolve) {
                resolve(result.value);
            }).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};

var temp = require('temp').track();
require('babel-polyfill');
require('source-map-support').install();
exports.expect = _chai.expect;

var webpack = require('webpack');
var BPromise = require('bluebird');
var mkdirp = BPromise.promisify(require('mkdirp'));
var rimraf = BPromise.promisify(require('rimraf'));
var readFile = BPromise.promisify(fs.readFile);
var writeFile = BPromise.promisify(fs.writeFile);
var loaderDir = path.join(process.cwd(), 'dist.babel');
var ForkCheckerPlugin = require(loaderDir).ForkCheckerPlugin;
var defaultOutputDir = exports.defaultOutputDir = path.join(process.cwd(), 'src', 'test', 'output');
var defaultFixturesDir = exports.defaultFixturesDir = path.join(process.cwd(), 'src', 'test', 'fixtures');
var defaultOptions = {
    watch: false,
    forkChecker: false
};
function createConfig(conf) {
    var _options = arguments.length <= 1 || arguments[1] === undefined ? defaultOptions : arguments[1];

    var options = _.merge({}, defaultOptions, _options);
    var defaultConfig = {
        watch: false,
        output: {
            path: defaultOutputDir,
            filename: '[name].js'
        },
        resolve: {
            extensions: ['', '.ts', '.tsx', '.js', '.jsx']
        },
        module: {
            loaders: [{
                test: /\.(tsx?|jsx?)/,
                loader: loaderDir,
                query: Object.assign({
                    target: 'es6'
                }, {
                    tsconfigContent: {
                        exclude: ["*"]
                    }
                }, options.loaderQuery)
            }]
        },
        plugins: []
    };
    var loader = defaultConfig.module.loaders[0];
    if (options.include) {
        loader.include = (loader.include || []).concat(options.include);
    }
    if (options.exclude) {
        loader.exclude = (loader.exclude || []).concat(options.exclude);
    }
    if (options.watch) {
        defaultConfig.watch = true;
    }
    if (options.forkChecker) {
        defaultConfig.plugins.push(new ForkCheckerPlugin());
    }
    return _.merge(defaultConfig, conf);
}
function chroot(root, foo) {
    return __awaiter(this, void 0, void 0, regeneratorRuntime.mark(function _callee() {
        var cwd, result;
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        cwd = process.cwd();

                        process.chdir(root);
                        _context.next = 4;
                        return foo();

                    case 4:
                        result = _context.sent;

                        process.chdir(cwd);
                        return _context.abrupt('return', result);

                    case 7:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, this);
    }));
}
function expectSource(source, fragment) {
    (0, _chai.expect)(source.replace(/\s/g, '')).include(fragment.replace(/\s/g, ''));
}
function fixturePath(fileName) {
    var fixturesDir = arguments.length <= 1 || arguments[1] === undefined ? defaultFixturesDir : arguments[1];

    return path.join.apply(path, [fixturesDir].concat(fileName));
}
function readFixture(fileName) {
    var fixturesDir = arguments.length <= 1 || arguments[1] === undefined ? defaultFixturesDir : arguments[1];

    var filePath = fixturePath(fileName, fixturesDir);
    return readFile(filePath).then(function (buf) {
        return buf.toString();
    });
}
function writeFixture(fileName, text) {
    var fixturesDir = arguments.length <= 2 || arguments[2] === undefined ? defaultFixturesDir : arguments[2];

    var filePath = fixturePath(fileName, fixturesDir);
    return writeFile(filePath, text);
}
function touchFile(fileName) {
    return readFile(fileName).then(function (buf) {
        return buf.toString();
    }).then(function (source) {
        return writeFile(fileName, source);
    });
}
function outputFileName(fileName) {
    var outputDir = arguments.length <= 1 || arguments[1] === undefined ? defaultOutputDir : arguments[1];

    return path.join(defaultOutputDir, fileName);
}
function readOutputFile(fileName) {
    var outputDir = arguments.length <= 1 || arguments[1] === undefined ? defaultOutputDir : arguments[1];

    return readFile(outputFileName(fileName || 'main.js', outputDir)).then(function (buf) {
        return buf.toString();
    });
}
function cleanOutputDir() {
    var outputDir = arguments.length <= 0 || arguments[0] === undefined ? defaultOutputDir : arguments[0];

    return rimraf(outputDir).then(function () {
        return mkdirp(outputDir);
    });
}
function cleanAndCompile(config) {
    var outputDir = arguments.length <= 1 || arguments[1] === undefined ? defaultOutputDir : arguments[1];

    return cleanOutputDir(outputDir).then(function () {
        return compile(config);
    });
}
function compile(config) {
    return new Promise(function (resolve, reject) {
        var compiler = webpack(config);
        compiler.run(function (err, stats) {
            if (err) {
                reject(err);
            } else {
                resolve(stats);
            }
        });
    });
}
function watch(config, cb) {
    var compiler = webpack(config);
    var watch = new Watch();
    var webpackWatcher = compiler.watch({}, function (err, stats) {
        watch.call(err, stats);
        if (cb) {
            cb(err, stats);
        }
    });
    watch.close = webpackWatcher.close;
    return watch;
}

var Watch = function () {
    function Watch() {
        _classCallCheck(this, Watch);

        this.resolves = [];
    }

    _createClass(Watch, [{
        key: 'call',
        value: function call(err, stats) {
            this.resolves.forEach(function (resolver) {
                resolver([err, stats]);
            });
            this.resolves = [];
        }
    }, {
        key: 'wait',
        value: function wait() {
            var _this = this;

            return new Promise(function (resolve, reject) {
                _this.resolves.push(resolve);
            });
        }
    }]);

    return Watch;
}();

var Fixture = exports.Fixture = function () {
    function Fixture(text) {
        var ext = arguments.length <= 1 || arguments[1] === undefined ? '.tsx' : arguments[1];

        _classCallCheck(this, Fixture);

        this.text = text;
        var tmpobj = temp.openSync({
            prefix: 'atl-',
            suffix: '.tsx'
        });
        this.fileName = tmpobj.path;
        fs.writeFileSync(this.fileName, text);
    }

    _createClass(Fixture, [{
        key: 'path',
        value: function path() {
            return this.fileName;
        }
    }, {
        key: 'touch',
        value: function touch() {
            touchFile(this.fileName);
        }
    }, {
        key: 'update',
        value: function update(updater) {
            var newText = updater(this.text);
            this.text = newText;
            fs.writeFileSync(this.fileName, newText);
        }
    }]);

    return Fixture;
}();
//# sourceMappingURL=utils.js.map