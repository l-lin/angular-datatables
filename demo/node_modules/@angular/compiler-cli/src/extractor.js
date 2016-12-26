/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
"use strict";
/**
 * Extract i18n messages from source code
 */
// Must be imported first, because angular2 decorators throws on load.
require('reflect-metadata');
var compiler = require('@angular/compiler');
var core_1 = require('@angular/core');
var codegen_1 = require('./codegen');
var reflector_host_1 = require('./reflector_host');
var static_reflection_capabilities_1 = require('./static_reflection_capabilities');
var static_reflector_1 = require('./static_reflector');
var Extractor = (function () {
    function Extractor(options, program, host, staticReflector, messageBundle, reflectorHost, metadataResolver) {
        this.options = options;
        this.program = program;
        this.host = host;
        this.staticReflector = staticReflector;
        this.messageBundle = messageBundle;
        this.reflectorHost = reflectorHost;
        this.metadataResolver = metadataResolver;
    }
    Extractor.prototype.extract = function () {
        var _this = this;
        var programSymbols = codegen_1.extractProgramSymbols(this.program, this.staticReflector, this.reflectorHost, this.options);
        var _a = compiler.analyzeAndValidateNgModules(programSymbols, { transitiveModules: true }, this.metadataResolver), ngModules = _a.ngModules, files = _a.files;
        return compiler.loadNgModuleDirectives(ngModules).then(function () {
            var errors = [];
            files.forEach(function (file) {
                var compMetas = [];
                file.directives.forEach(function (directiveType) {
                    var dirMeta = _this.metadataResolver.getDirectiveMetadata(directiveType);
                    if (dirMeta && dirMeta.isComponent) {
                        compMetas.push(dirMeta);
                    }
                });
                compMetas.forEach(function (compMeta) {
                    var html = compMeta.template.template;
                    var interpolationConfig = compiler.InterpolationConfig.fromArray(compMeta.template.interpolation);
                    errors.push.apply(errors, _this.messageBundle.updateFromTemplate(html, file.srcUrl, interpolationConfig));
                });
            });
            if (errors.length) {
                throw new Error(errors.map(function (e) { return e.toString(); }).join('\n'));
            }
            return _this.messageBundle;
        });
    };
    Extractor.create = function (options, translationsFormat, program, compilerHost, resourceLoader, reflectorHost) {
        var htmlParser = new compiler.I18NHtmlParser(new compiler.HtmlParser());
        var urlResolver = compiler.createOfflineCompileUrlResolver();
        if (!reflectorHost)
            reflectorHost = new reflector_host_1.ReflectorHost(program, compilerHost, options);
        var staticReflector = new static_reflector_1.StaticReflector(reflectorHost);
        static_reflection_capabilities_1.StaticAndDynamicReflectionCapabilities.install(staticReflector);
        var config = new compiler.CompilerConfig({
            genDebugInfo: options.debug === true,
            defaultEncapsulation: core_1.ViewEncapsulation.Emulated,
            logBindingUpdate: false,
            useJit: false
        });
        var normalizer = new compiler.DirectiveNormalizer(resourceLoader, urlResolver, htmlParser, config);
        var elementSchemaRegistry = new compiler.DomElementSchemaRegistry();
        var resolver = new compiler.CompileMetadataResolver(new compiler.NgModuleResolver(staticReflector), new compiler.DirectiveResolver(staticReflector), new compiler.PipeResolver(staticReflector), elementSchemaRegistry, normalizer, staticReflector);
        // TODO(vicb): implicit tags & attributes
        var messageBundle = new compiler.MessageBundle(htmlParser, [], {});
        return new Extractor(options, program, compilerHost, staticReflector, messageBundle, reflectorHost, resolver);
    };
    return Extractor;
}());
exports.Extractor = Extractor;
//# sourceMappingURL=extractor.js.map