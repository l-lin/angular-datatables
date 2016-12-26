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
    it('should compile proejct with initialFiles', function () {
        return __awaiter(this, void 0, void 0, function* () {
            const config = createConfig({
                entry: fixturePath(['initialFiles', 'Client', 'src', 'main.ts'])
            }, {
                loaderQuery: {
                    tsconfigContent: undefined,
                    tsconfig: fixturePath(['initialFiles', 'Client', 'tsconfig.json'])
                }
            });
            let stats = yield chroot(fixturePath('initialFiles'), () => __awaiter(this, void 0, void 0, function* () {
                return yield cleanAndCompile(config);
            }));
            console.log(stats.compilation.errors);
            expect(stats.compilation.errors.length).eq(1);
            expect(stats.compilation.errors[0].toString().indexOf('ModuleNotFoundError: Module not found:')).eq(0);
        });
    });
});
//# sourceMappingURL=initialFiles.js.map