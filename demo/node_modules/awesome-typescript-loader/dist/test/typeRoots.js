var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
import { cleanAndCompile, expect, fixturePath, createConfig, chroot } from './utils';
describe('main test', function () {
    it('should compile proejct with typeRoots', function () {
        return __awaiter(this, void 0, void 0, function* () {
            const config = createConfig({
                entry: fixturePath(['typeRoots', 'index.ts'])
            }, {
                loaderQuery: {
                    tsconfigContent: undefined,
                    tsconfig: fixturePath(['typeRoots', 'tsconfig.json'])
                }
            });
            let stats = yield chroot(fixturePath('typeRoots'), () => __awaiter(this, void 0, void 0, function* () {
                return yield cleanAndCompile(config);
            }));
            expect(stats.compilation.errors.length).eq(0);
        });
    });
});
//# sourceMappingURL=typeRoots.js.map