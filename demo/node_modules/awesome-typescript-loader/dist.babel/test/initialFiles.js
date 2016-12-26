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
    it('should compile proejct with initialFiles', function () {
        return __awaiter(this, void 0, void 0, regeneratorRuntime.mark(function _callee2() {
            var _this = this;

            var config, stats;
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            config = (0, _utils.createConfig)({
                                entry: (0, _utils.fixturePath)(['initialFiles', 'Client', 'src', 'main.ts'])
                            }, {
                                loaderQuery: {
                                    tsconfigContent: undefined,
                                    tsconfig: (0, _utils.fixturePath)(['initialFiles', 'Client', 'tsconfig.json'])
                                }
                            });
                            _context2.next = 3;
                            return (0, _utils.chroot)((0, _utils.fixturePath)('initialFiles'), function () {
                                return __awaiter(_this, void 0, void 0, regeneratorRuntime.mark(function _callee() {
                                    return regeneratorRuntime.wrap(function _callee$(_context) {
                                        while (1) {
                                            switch (_context.prev = _context.next) {
                                                case 0:
                                                    _context.next = 2;
                                                    return (0, _utils.cleanAndCompile)(config);

                                                case 2:
                                                    return _context.abrupt('return', _context.sent);

                                                case 3:
                                                case 'end':
                                                    return _context.stop();
                                            }
                                        }
                                    }, _callee, this);
                                }));
                            });

                        case 3:
                            stats = _context2.sent;

                            console.log(stats.compilation.errors);
                            (0, _utils.expect)(stats.compilation.errors.length).eq(1);
                            (0, _utils.expect)(stats.compilation.errors[0].toString().indexOf('ModuleNotFoundError: Module not found:')).eq(0);

                        case 7:
                        case 'end':
                            return _context2.stop();
                    }
                }
            }, _callee2, this);
        }));
    });
});
//# sourceMappingURL=initialFiles.js.map