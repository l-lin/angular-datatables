var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
import { expect, fixturePath, createConfig, cleanOutputDir, watch, touchFile } from './utils';
let ps = require('ps-node');
function getCheckerRuntimeProcess() {
    let opts = {
        command: /node/,
        arguments: /checker-runtime.js/,
    };
    return new Promise((resolve, reject) => {
        ps.lookup(opts, (err, resultList) => {
            resolve(resultList[0]);
        });
    });
}
;
function kill(p) {
    return new Promise((resolve, reject) => {
        ps.kill(p.pid, resolve);
    });
}
;
function sleep(time) {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, time);
    });
}
;
describe('checker test', function () {
    this.timeout(5000);
    let fixture = fixturePath(['checker', 'to-check.ts']);
    let config = createConfig({
        entry: fixture,
    }, {
        watch: true,
        forkChecker: true,
        loaderQuery: {
            forkChecker: true
        }
    });
    it('should fork checker in separate process', function () {
        return __awaiter(this, void 0, void 0, function* () {
            yield cleanOutputDir();
            let watcher = watch(config);
            yield watcher.wait();
            let pid = yield getCheckerRuntimeProcess();
            expect(pid).ok;
            watcher.close();
            yield kill(pid);
        });
    });
    it('should fork only one checker after multiple changes', function () {
        return __awaiter(this, void 0, void 0, function* () {
            // I didn't get how to test it more precise, so it's more like a proof of work
            yield cleanOutputDir();
            let watcher = watch(config, () => { });
            yield watcher.wait();
            let pid = yield getCheckerRuntimeProcess();
            expect(pid).ok;
            let i = 10;
            while (i--) {
                yield touchFile(fixture);
                yield sleep(50);
            }
            yield sleep(2000);
            watcher.close();
            yield kill(pid);
        });
    });
});
//# sourceMappingURL=checker.js.map