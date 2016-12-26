'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

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

describe('checker test', function () {
    this.timeout(5000);
    var fixture = new _utils.Fixture('\n        let a: string;\n        function check(arg1: string) { }\n        check(a);\n    ', '.ts');
    var config = (0, _utils.createConfig)({
        entry: fixture.path()
    }, {
        watch: true
    });
    it('should watch changes', function () {
        return __awaiter(this, void 0, void 0, regeneratorRuntime.mark(function _callee() {
            var watcher, _ref, _ref2, err, stats, _ref3, _ref4, _err, _stats;

            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            _context.next = 2;
                            return (0, _utils.cleanOutputDir)();

                        case 2:
                            _context.next = 4;
                            return (0, _utils.watch)(config);

                        case 4:
                            watcher = _context.sent;
                            _context.next = 7;
                            return watcher.wait();

                        case 7:
                            _ref = _context.sent;
                            _ref2 = _slicedToArray(_ref, 2);
                            err = _ref2[0];
                            stats = _ref2[1];

                            (0, _utils.expect)(err).not.ok;
                            (0, _utils.expect)(stats.compilation.errors).lengthOf(0);

                            fixture.update(function (text) {
                                return text.replace('let a: string;', 'let a: number;');
                            });
                            _context.next = 16;
                            return watcher.wait();

                        case 16:
                            _ref3 = _context.sent;
                            _ref4 = _slicedToArray(_ref3, 2);
                            _err = _ref4[0];
                            _stats = _ref4[1];

                            (0, _utils.expect)(_err).not.ok;
                            (0, _utils.expect)(_stats.compilation.errors).lengthOf(1);

                            watcher.close();

                        case 23:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, this);
        }));
    });
});
//# sourceMappingURL=watch-type-errors.js.map