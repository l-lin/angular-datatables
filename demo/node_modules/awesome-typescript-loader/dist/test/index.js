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
    it('should compile simple file', function () {
        return __awaiter(this, void 0, void 0, function* () {
            let config = {
                entry: fixturePath(['basic', 'basic.ts'])
            };
            let stats = yield cleanAndCompile(createConfig(config));
            expect(stats.compilation.errors.length).eq(0);
            let result = yield readOutputFile();
            let expectation = yield readFixture(['basic', 'basic.js']);
            expectSource(result, expectation);
        });
    });
    it('should check typing', function () {
        return __awaiter(this, void 0, void 0, function* () {
            let config = {
                entry: fixturePath(['errors', 'with-type-errors.ts'])
            };
            let stats = yield cleanAndCompile(createConfig(config));
            expect(stats.compilation.errors.length).eq(1);
        });
    });
    it('should ignore diagnostics', function () {
        return __awaiter(this, void 0, void 0, function* () {
            let config = {
                entry: fixturePath(['errors', 'with-type-errors.ts'])
            };
            let loaderQuery = { ignoreDiagnostics: [2345] };
            let stats = yield cleanAndCompile(createConfig(config, { loaderQuery }));
            expect(stats.compilation.errors.length).eq(0);
        });
    });
    it('should load tsx files and use tsconfig', function () {
        return __awaiter(this, void 0, void 0, function* () {
            let tsconfig = fixturePath(['tsx', 'tsconfig.json']);
            let config = {
                entry: fixturePath(['tsx', 'basic.tsx'])
            };
            let loaderQuery = { tsconfig, tsconfigContent: null };
            let stats = yield cleanAndCompile(createConfig(config, { loaderQuery }));
            expect(stats.compilation.errors.length).eq(1);
            let result = yield readOutputFile();
            let expectation = 'return React.createElement("div", null, "hi there");';
            expectSource(result, expectation);
        });
    });
});
//# sourceMappingURL=index.js.map