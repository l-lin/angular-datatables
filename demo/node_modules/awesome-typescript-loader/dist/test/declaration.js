var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
import { cleanAndCompile, expect, fixturePath, createConfig } from './utils';
describe('main test', function () {
    it('should emit declaration files', function () {
        return __awaiter(this, void 0, void 0, function* () {
            // babel need some time to init
            this.timeout(10000);
            let config = {
                entry: fixturePath(['declaration', 'basic.ts'])
            };
            let loaderQuery = {
                declaration: true
            };
            let stats = yield cleanAndCompile(createConfig(config, { loaderQuery }));
            expect(stats.compilation.errors.length).eq(0);
            let assets = Object.keys(stats.compilation.assets);
            expect(assets).to.include('src/test/fixtures/declaration/basic.d.ts');
            // elided import
            expect(assets).to.include('src/test/fixtures/declaration/iface.d.ts');
        });
    });
});
//# sourceMappingURL=declaration.js.map