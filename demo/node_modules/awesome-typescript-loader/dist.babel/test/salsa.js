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

describe('salsa test', function () {
    it('should compile ts file with js invoke', function () {
        return __awaiter(this, void 0, void 0, regeneratorRuntime.mark(function _callee() {
            var config, tsconfig, loaderQuery, stats;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            config = {
                                entry: (0, _utils.fixturePath)(['salsa', 'index.ts'])
                            };
                            tsconfig = (0, _utils.fixturePath)(['salsa', 'tsconfig.json']);
                            loaderQuery = { tsconfig: tsconfig, tsconfigContent: null };
                            _context.next = 5;
                            return (0, _utils.cleanAndCompile)((0, _utils.createConfig)(config, { loaderQuery: loaderQuery }));

                        case 5:
                            stats = _context.sent;

                            console.log(stats.compilation.errors);
                            (0, _utils.expect)(stats.compilation.errors.length).eq(1);

                        case 8:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, this);
        }));
    });
    xit('should compile js file as entry point', function () {
        return __awaiter(this, void 0, void 0, regeneratorRuntime.mark(function _callee2() {
            var config, tsconfig, loaderQuery, stats;
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            config = {
                                entry: (0, _utils.fixturePath)(['salsa', 'index.js'])
                            };
                            tsconfig = (0, _utils.fixturePath)(['salsa', 'tsconfig.json']);
                            loaderQuery = { tsconfig: tsconfig, tsconfigContent: null };
                            _context2.next = 5;
                            return (0, _utils.cleanAndCompile)((0, _utils.createConfig)(config, { loaderQuery: loaderQuery }));

                        case 5:
                            stats = _context2.sent;

                            console.log(stats.compilation.errors);
                            (0, _utils.expect)(stats.compilation.errors.length).eq(1);

                        case 8:
                        case 'end':
                            return _context2.stop();
                    }
                }
            }, _callee2, this);
        }));
    });
});
//# sourceMappingURL=salsa.js.map