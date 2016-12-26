#!/usr/bin/env node
"use strict";
require('reflect-metadata');
var compiler = require('@angular/compiler');
var tsc = require('@angular/tsc-wrapped');
var path = require('path');
var extractor_1 = require('./extractor');
function extract(ngOptions, cliOptions, program, host) {
    var resourceLoader = {
        get: function (s) {
            if (!host.fileExists(s)) {
                // TODO: We should really have a test for error cases like this!
                throw new Error("Compilation failed. Resource file not found: " + s);
            }
            return Promise.resolve(host.readFile(s));
        }
    };
    var extractor = extractor_1.Extractor.create(ngOptions, cliOptions.i18nFormat, program, host, resourceLoader);
    var bundlePromise = extractor.extract();
    return (bundlePromise).then(function (messageBundle) {
        var ext;
        var serializer;
        var format = (cliOptions.i18nFormat || 'xlf').toLowerCase();
        switch (format) {
            case 'xmb':
                ext = 'xmb';
                serializer = new compiler.Xmb();
                break;
            case 'xliff':
            case 'xlf':
            default:
                var htmlParser = new compiler.I18NHtmlParser(new compiler.HtmlParser());
                ext = 'xlf';
                serializer = new compiler.Xliff(htmlParser, compiler.DEFAULT_INTERPOLATION_CONFIG);
                break;
        }
        var dstPath = path.join(ngOptions.genDir, "messages." + ext);
        host.writeFile(dstPath, messageBundle.write(serializer), false);
    });
}
// Entry point
if (require.main === module) {
    var args = require('minimist')(process.argv.slice(2));
    var project = args.p || args.project || '.';
    var cliOptions = new tsc.I18nExtractionCliOptions(args);
    tsc.main(project, cliOptions, extract)
        .then(function (exitCode) { return process.exit(exitCode); })
        .catch(function (e) {
        console.error(e.stack);
        console.error('Extraction failed');
        process.exit(1);
    });
}
//# sourceMappingURL=extract_i18n.js.map