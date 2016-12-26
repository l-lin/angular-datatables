var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
import { cleanAndCompile, expect, fixturePath, createConfig, chroot } from './utils';
describe('react test', function () {
    it('should compile proejct with react typings', function () {
        return __awaiter(this, void 0, void 0, function* () {
            const config = createConfig({
                entry: fixturePath(['react', 'index.tsx'])
            }, {
                loaderQuery: {
                    tsconfigContent: undefined,
                    tsconfig: fixturePath(['react', 'tsconfig.json'])
                }
            });
            let stats = yield chroot(fixturePath('react'), () => __awaiter(this, void 0, void 0, function* () {
                return yield cleanAndCompile(config);
            }));
            expect(stats.compilation.errors.length).eq(2);
            expect(stats.compilation.errors[0].toString().indexOf('ModuleNotFoundError: Module not found:')).eq(0);
            expect(stats.compilation.errors[1].toString().indexOf('ModuleNotFoundError: Module not found:')).eq(0);
        });
    });
});
//# sourceMappingURL=react.js.map