"use strict";
var instance_1 = require('./instance');
var path = require('path');
var _ = require('lodash');
var ModulesInRootPlugin = require('enhanced-resolve/lib/ModulesInRootPlugin');
var createInnerCallback = require('enhanced-resolve/lib/createInnerCallback');
var getInnerRequest = require('enhanced-resolve/lib/getInnerRequest');
function escapeRegExp(str) {
    return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}
var PathsPlugin = (function () {
    function PathsPlugin(config) {
        var _this = this;
        if (config === void 0) { config = {}; }
        this.source = 'described-resolve';
        this.target = 'resolve';
        this.ts = instance_1.setupTs(config.compiler).tsImpl;
        var _a = instance_1.readConfigFile(process.cwd(), config, this.ts), configFilePath = _a.configFilePath, compilerConfig = _a.compilerConfig;
        this.options = compilerConfig.options;
        this.configFilePath = configFilePath;
        this.baseUrl = this.options.baseUrl;
        this.absoluteBaseUrl = path.resolve(path.dirname(this.configFilePath), this.baseUrl || '.');
        this.mappings = [];
        var paths = this.options.paths || {};
        Object.keys(paths).forEach(function (alias) {
            var onlyModule = alias.indexOf('*') === -1;
            var excapedAlias = escapeRegExp(alias);
            var targets = paths[alias];
            targets.forEach(function (target) {
                var aliasPattern;
                if (onlyModule) {
                    aliasPattern = new RegExp("^" + excapedAlias + "$");
                }
                else {
                    var withStarCapturing = excapedAlias.replace('\\*', '(.*)');
                    aliasPattern = new RegExp("^" + withStarCapturing);
                }
                _this.mappings.push({
                    onlyModule: onlyModule,
                    alias: alias,
                    aliasPattern: aliasPattern,
                    target: target
                });
            });
        });
    }
    PathsPlugin.prototype.apply = function (resolver) {
        var _this = this;
        var _a = this, baseUrl = _a.baseUrl, mappings = _a.mappings;
        if (baseUrl) {
            resolver.apply(new ModulesInRootPlugin("module", this.absoluteBaseUrl, "resolve"));
        }
        mappings.forEach(function (mapping) {
            resolver.plugin(_this.source, _this.createPlugin(resolver, mapping));
        });
    };
    PathsPlugin.prototype.createPlugin = function (resolver, mapping) {
        var _this = this;
        return function (request, callback) {
            var innerRequest = getInnerRequest(resolver, request);
            if (!innerRequest) {
                return callback();
            }
            var match = innerRequest.match(mapping.aliasPattern);
            if (!match) {
                return callback();
            }
            var newRequestStr = mapping.target;
            if (!mapping.onlyModule) {
                newRequestStr = newRequestStr.replace('*', match[1]);
            }
            if (newRequestStr[0] === '.') {
                newRequestStr = path.resolve(_this.absoluteBaseUrl, newRequestStr);
            }
            var newRequest = _.extend({}, request, {
                request: newRequestStr
            });
            return resolver.doResolve(_this.target, newRequest, "aliased with mapping '" + innerRequest + "': '" + mapping.alias + "' to '" + newRequestStr + "'", createInnerCallback(function (err, result) {
                if (arguments.length > 0) {
                    return callback(err, result);
                }
                callback(null, null);
            }, callback));
        };
    };
    return PathsPlugin;
}());
exports.PathsPlugin = PathsPlugin;
//# sourceMappingURL=paths-plugin.js.map