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
    it('should transpile without sourceamps', function () {
        return __awaiter(this, void 0, void 0, regeneratorRuntime.mark(function _callee() {
            var config, loaderQuery, stats;
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
                                sourceMap: false,
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

                        case 7:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, this);
        }));
    });
});
//# sourceMappingURL=without-sourcemap.js.map