'use strict';

var _utils = require('./utils');

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

describe('main test', function () {
    it('should transpile file with babel', function () {
        return __awaiter(this, void 0, void 0, regeneratorRuntime.mark(function _callee() {
            var config, loaderQuery, stats, result, expectation;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            // babel need some time to init
                            this.timeout(10000);
                            config = {
                                entry: (0, _utils.fixturePath)(['babel', 'babel.ts'])
                            };
                            loaderQuery = {
                                useBabel: true,
                                babelOptions: {
                                    "presets": ["es2015"]
                                }
                            };
                            _context.next = 5;
                            return (0, _utils.cleanAndCompile)((0, _utils.createConfig)(config, { loaderQuery: loaderQuery }));

                        case 5:
                            stats = _context.sent;

                            (0, _utils.expect)(stats.compilation.errors.length).eq(0);
                            _context.next = 9;
                            return (0, _utils.readOutputFile)();

                        case 9:
                            result = _context.sent;
                            _context.next = 12;
                            return (0, _utils.readFixture)(['babel', 'babel.js']);

                        case 12:
                            expectation = _context.sent;

                            (0, _utils.expectSource)(result, expectation);

                        case 14:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, this);
        }));
    });
    it('should use options from query', function () {
        return __awaiter(this, void 0, void 0, regeneratorRuntime.mark(function _callee2() {
            var config, loaderQuery, throws, stats;
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            // babel need some time to init
                            this.timeout(10000);
                            config = {
                                entry: (0, _utils.fixturePath)(['babel', 'babel.ts'])
                            };
                            loaderQuery = {
                                useBabel: true,
                                babelOptions: {
                                    "presets": ["unknown-preset"]
                                }
                            };
                            throws = false;
                            _context2.prev = 4;
                            _context2.next = 7;
                            return (0, _utils.cleanAndCompile)((0, _utils.createConfig)(config, { loaderQuery: loaderQuery }));

                        case 7:
                            stats = _context2.sent;

                            (0, _utils.expect)(stats.compilation.errors.length).eq(0);
                            _context2.next = 14;
                            break;

                        case 11:
                            _context2.prev = 11;
                            _context2.t0 = _context2['catch'](4);

                            throws = true;

                        case 14:
                            (0, _utils.expect)(throws).to.true;

                        case 15:
                        case 'end':
                            return _context2.stop();
                    }
                }
            }, _callee2, this, [[4, 11]]);
        }));
    });
});
//# sourceMappingURL=babel.js.map