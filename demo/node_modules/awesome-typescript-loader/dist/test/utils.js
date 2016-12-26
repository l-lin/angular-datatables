/// <reference path="../defines.d.ts" />
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
import * as path from 'path';
import * as fs from 'fs';
import * as _ from 'lodash';
const temp = require('temp').track();
require('babel-polyfill');
require('source-map-support').install();
import { expect } from 'chai';
export { expect };
const webpack = require('webpack');
const BPromise = require('bluebird');
const mkdirp = BPromise.promisify(require('mkdirp'));
const rimraf = BPromise.promisify(require('rimraf'));
const readFile = BPromise.promisify(fs.readFile);
const writeFile = BPromise.promisify(fs.writeFile);
const loaderDir = path.join(process.cwd(), 'dist.babel');
const ForkCheckerPlugin = require(loaderDir).ForkCheckerPlugin;
export const defaultOutputDir = path.join(process.cwd(), 'src', 'test', 'output');
export const defaultFixturesDir = path.join(process.cwd(), 'src', 'test', 'fixtures');
let defaultOptions = {
    watch: false,
    forkChecker: false,
};
export function createConfig(conf, _options = defaultOptions) {
    let options = _.merge({}, defaultOptions, _options);
    const defaultConfig = {
        watch: false,
        output: {
            path: defaultOutputDir,
            filename: '[name].js'
        },
        resolve: {
            extensions: ['', '.ts', '.tsx', '.js', '.jsx'],
        },
        module: {
            loaders: [
                {
                    test: /\.(tsx?|jsx?)/,
                    loader: loaderDir,
                    query: Object.assign({
                        target: 'es6',
                    }, {
                        tsconfigContent: {
                            exclude: ["*"]
                        }
                    }, options.loaderQuery)
                },
            ],
        },
        plugins: []
    };
    let loader = defaultConfig.module.loaders[0];
    if (options.include) {
        loader.include = (loader.include || []).concat(options.include);
    }
    if (options.exclude) {
        loader.exclude = (loader.exclude || []).concat(options.exclude);
    }
    if (options.watch) {
        defaultConfig.watch = true;
    }
    if (options.forkChecker) {
        defaultConfig.plugins.push(new ForkCheckerPlugin());
    }
    return _.merge(defaultConfig, conf);
}
export function chroot(root, foo) {
    return __awaiter(this, void 0, void 0, function* () {
        let cwd = process.cwd();
        process.chdir(root);
        let result = yield foo();
        process.chdir(cwd);
        return result;
    });
}
export function expectSource(source, fragment) {
    expect(source.replace(/\s/g, '')).include(fragment.replace(/\s/g, ''));
}
export function fixturePath(fileName, fixturesDir = defaultFixturesDir) {
    return path.join.apply(path, [fixturesDir].concat(fileName));
}
export function readFixture(fileName, fixturesDir = defaultFixturesDir) {
    let filePath = fixturePath(fileName, fixturesDir);
    return readFile(filePath).then(buf => buf.toString());
}
export function writeFixture(fileName, text, fixturesDir = defaultFixturesDir) {
    let filePath = fixturePath(fileName, fixturesDir);
    return writeFile(filePath, text);
}
export function touchFile(fileName) {
    return readFile(fileName)
        .then(buf => buf.toString())
        .then(source => writeFile(fileName, source));
}
export function outputFileName(fileName, outputDir = defaultOutputDir) {
    return path.join(defaultOutputDir, fileName);
}
export function readOutputFile(fileName, outputDir = defaultOutputDir) {
    return readFile(outputFileName(fileName || 'main.js', outputDir)).then(buf => buf.toString());
}
export function cleanOutputDir(outputDir = defaultOutputDir) {
    return rimraf(outputDir)
        .then(() => mkdirp(outputDir));
}
export function cleanAndCompile(config, outputDir = defaultOutputDir) {
    return cleanOutputDir(outputDir)
        .then(() => compile(config));
}
export function compile(config) {
    return new Promise((resolve, reject) => {
        let compiler = webpack(config);
        compiler.run((err, stats) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(stats);
            }
        });
    });
}
export function watch(config, cb) {
    let compiler = webpack(config);
    let watch = new Watch();
    let webpackWatcher = compiler.watch({}, (err, stats) => {
        watch.call(err, stats);
        if (cb) {
            cb(err, stats);
        }
    });
    watch.close = webpackWatcher.close;
    return watch;
}
class Watch {
    constructor() {
        this.resolves = [];
    }
    call(err, stats) {
        this.resolves.forEach(resolver => {
            resolver([err, stats]);
        });
        this.resolves = [];
    }
    wait() {
        return new Promise((resolve, reject) => {
            this.resolves.push(resolve);
        });
    }
}
export class Fixture {
    constructor(text, ext = '.tsx') {
        this.text = text;
        let tmpobj = temp.openSync({
            prefix: 'atl-',
            suffix: '.tsx'
        });
        this.fileName = tmpobj.path;
        fs.writeFileSync(this.fileName, text);
    }
    path() {
        return this.fileName;
    }
    touch() {
        touchFile(this.fileName);
    }
    update(updater) {
        let newText = updater(this.text);
        this.text = newText;
        fs.writeFileSync(this.fileName, newText);
    }
}
//# sourceMappingURL=utils.js.map