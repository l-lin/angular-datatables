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
    it('should compile simple file', function () {
        return __awaiter(this, void 0, void 0, regeneratorRuntime.mark(function _callee() {
            var config, stats, result, expectation;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            config = {
                                entry: (0, _utils.fixturePath)(['basic', 'basic.ts'])
                            };
                            _context.next = 3;
                            return (0, _utils.cleanAndCompile)((0, _utils.createConfig)(config));

                        case 3:
                            stats = _context.sent;

                            (0, _utils.expect)(stats.compilation.errors.length).eq(0);
                            _context.next = 7;
                            return (0, _utils.readOutputFile)();

                        case 7:
                            result = _context.sent;
                            _context.next = 10;
                            return (0, _utils.readFixture)(['basic', 'basic.js']);

                        case 10:
                            expectation = _context.sent;

                            (0, _utils.expectSource)(result, expectation);

                        case 12:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, this);
        }));
    });
    it('should check typing', function () {
        return __awaiter(this, void 0, void 0, regeneratorRuntime.mark(function _callee2() {
            var config, stats;
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            config = {
                                entry: (0, _utils.fixturePath)(['errors', 'with-type-errors.ts'])
                            };
                            _context2.next = 3;
                            return (0, _utils.cleanAndCompile)((0, _utils.createConfig)(config));

                        case 3:
                            stats = _context2.sent;

                            (0, _utils.expect)(stats.compilation.errors.length).eq(1);

                        case 5:
                        case 'end':
                            return _context2.stop();
                    }
                }
            }, _callee2, this);
        }));
    });
    it('should ignore diagnostics', function () {
        return __awaiter(this, void 0, void 0, regeneratorRuntime.mark(function _callee3() {
            var config, loaderQuery, stats;
            return regeneratorRuntime.wrap(function _callee3$(_context3) {
                while (1) {
                    switch (_context3.prev = _context3.next) {
                        case 0:
                            config = {
                                entry: (0, _utils.fixturePath)(['errors', 'with-type-errors.ts'])
                            };
                            loaderQuery = { ignoreDiagnostics: [2345] };
                            _context3.next = 4;
                            return (0, _utils.cleanAndCompile)((0, _utils.createConfig)(config, { loaderQuery: loaderQuery }));

                        case 4:
                            stats = _context3.sent;

                            (0, _utils.expect)(stats.compilation.errors.length).eq(0);

                        case 6:
                        case 'end':
                            return _context3.stop();
                    }
                }
            }, _callee3, this);
        }));
    });
    it('should load tsx files and use tsconfig', function () {
        return __awaiter(this, void 0, void 0, regeneratorRuntime.mark(function _callee4() {
            var tsconfig, config, loaderQuery, stats, result, expectation;
            return regeneratorRuntime.wrap(function _callee4$(_context4) {
                while (1) {
                    switch (_context4.prev = _context4.next) {
                        case 0:
                            tsconfig = (0, _utils.fixturePath)(['tsx', 'tsconfig.json']);
                            config = {
                                entry: (0, _utils.fixturePath)(['tsx', 'basic.tsx'])
                            };
                            loaderQuery = { tsconfig: tsconfig, tsconfigContent: null };
                            _context4.next = 5;
                            return (0, _utils.cleanAndCompile)((0, _utils.createConfig)(config, { loaderQuery: loaderQuery }));

                        case 5:
                            stats = _context4.sent;

                            (0, _utils.expect)(stats.compilation.errors.length).eq(1);
                            _context4.next = 9;
                            return (0, _utils.readOutputFile)();

                        case 9:
                            result = _context4.sent;
                            expectation = 'return React.createElement("div", null, "hi there");';

                            (0, _utils.expectSource)(result, expectation);

                        case 12:
                        case 'end':
                            return _context4.stop();
                    }
                }
            }, _callee4, this);
        }));
    });
});
//# sourceMappingURL=index.js.map