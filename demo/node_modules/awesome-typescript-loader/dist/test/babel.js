var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
import { cleanAndCompile, expect, readOutputFile, fixturePath, readFixture, expectSource, createConfig } from './utils';
describe('main test', function () {
    it('should transpile file with babel', function () {
        return __awaiter(this, void 0, void 0, function* () {
            // babel need some time to init
            this.timeout(10000);
            let config = {
                entry: fixturePath(['babel', 'babel.ts'])
            };
            let loaderQuery = {
                useBabel: true,
                babelOptions: {
                    "presets": ["es2015"]
                }
            };
            let stats = yield cleanAndCompile(createConfig(config, { loaderQuery }));
            expect(stats.compilation.errors.length).eq(0);
            let result = yield readOutputFile();
            let expectation = yield readFixture(['babel', 'babel.js']);
            expectSource(result, expectation);
        });
    });
    it('should use options from query', function () {
        return __awaiter(this, void 0, void 0, function* () {
            // babel need some time to init
            this.timeout(10000);
            let config = {
                entry: fixturePath(['babel', 'babel.ts'])
            };
            let loaderQuery = {
                useBabel: true,
                babelOptions: {
                    "presets": ["unknown-preset"]
                }
            };
            let throws = false;
            try {
                let stats = yield cleanAndCompile(createConfig(config, { loaderQuery }));
                expect(stats.compilation.errors.length).eq(0);
            }
            catch (e) {
                throws = true;
            }
            expect(throws).to.true;
        });
    });
});
//# sourceMappingURL=babel.js.map