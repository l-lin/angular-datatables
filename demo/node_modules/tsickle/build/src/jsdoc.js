"use strict";
function arrayIncludes(array, key) {
    for (var _i = 0, array_1 = array; _i < array_1.length; _i++) {
        var elem = array_1[_i];
        if (elem === key)
            return true;
    }
    return false;
}
/**
 * A list of all JSDoc tags allowed by the Closure compiler.
 * The public Closure docs don't list all the tags it allows; this list comes
 * from the compiler source itself.
 * https://github.com/google/closure-compiler/blob/master/src/com/google/javascript/jscomp/parsing/Annotation.java
 */
var JSDOC_TAGS_WHITELIST = [
    'ngInject',
    'abstract',
    'argument',
    'author',
    'consistentIdGenerator',
    'const',
    'constant',
    'constructor',
    'copyright',
    'define',
    'deprecated',
    'desc',
    'dict',
    'disposes',
    'enum',
    'export',
    'expose',
    'extends',
    'externs',
    'fileoverview',
    'final',
    'hidden',
    'idGenerator',
    'implements',
    'implicitCast',
    'inheritDoc',
    'interface',
    'record',
    'jaggerInject',
    'jaggerModule',
    'jaggerProvidePromise',
    'jaggerProvide',
    'lends',
    'license',
    'meaning',
    'modifies',
    'noalias',
    'nocollapse',
    'nocompile',
    'nosideeffects',
    'override',
    'owner',
    'package',
    'param',
    'polymerBehavior',
    'preserve',
    'preserveTry',
    'private',
    'protected',
    'public',
    'return',
    'returns',
    'see',
    'stableIdGenerator',
    'struct',
    'suppress',
    'template',
    'this',
    'throws',
    'type',
    'typedef',
    'unrestricted',
    'version',
    'wizaction',
];
/**
 * A list of JSDoc @tags that are never allowed in TypeScript source.
 * These are Closure tags that can be expressed in the TypeScript surface
 * syntax.
 */
var JSDOC_TAGS_BLACKLIST = ['private', 'public', 'type'];
/** A list of JSDoc @tags that might include a {type} after them. */
var JSDOC_TAGS_WITH_TYPES = ['export', 'param', 'return'];
/**
 * parse parses JSDoc out of a comment string.
 * Returns null if comment is not JSDoc.
 */
function parse(comment) {
    // TODO(evanm): this is a pile of hacky regexes for now, because we
    // would rather use the better TypeScript implementation of JSDoc
    // parsing.  https://github.com/Microsoft/TypeScript/issues/7393
    var match = comment.match(/^\/\*\*([\s\S]*?)\*\/$/);
    if (!match)
        return null;
    comment = match[1].trim();
    // Strip all the " * " bits from the front of each line.
    comment = comment.replace(/^\s*\* /gm, '');
    var lines = comment.split('\n');
    var tags = [];
    var warnings = [];
    for (var _i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
        var line = lines_1[_i];
        match = line.match(/^@(\S+) *(.*)/);
        if (match) {
            var _ = match[0], tagName = match[1], text = match[2];
            if (tagName === 'returns') {
                // A synonym for 'return'.
                tagName = 'return';
            }
            if (arrayIncludes(JSDOC_TAGS_BLACKLIST, tagName)) {
                warnings.push("@" + tagName + " annotations are redundant with TypeScript equivalents");
                continue; // Drop the tag so Closure won't process it.
            }
            else if (arrayIncludes(JSDOC_TAGS_WITH_TYPES, tagName) && text[0] === '{') {
                warnings.push('type annotations (using {...}) are redundant with TypeScript types');
                continue;
            }
            else if (!arrayIncludes(JSDOC_TAGS_WHITELIST, tagName)) {
                // Silently drop tags we don't understand.  This is a subtle
                // compromise between multiple issues.
                // 1) If we pass through these non-Closure tags, the user will
                //    get a warning from Closure, and the point of tsickle is
                //    to insulate the user from Closure.
                // 2) The output of tsickle is for Closure only, so we don't
                //    care if we drop tags that Closure doesn't undersand.
                // 3) Finally, we don't want to warn because users should be
                //    free to add whichever JSDoc they feel like.  If the user
                //    wants help ensuring they didn't typo a tag, that is the
                //    responsibility of a linter.
                continue;
            }
            // Grab the parameter name from @param tags.
            var parameterName = void 0;
            if (tagName === 'param') {
                match = text.match(/^(\S+) ?(.*)/);
                if (match)
                    _ = match[0], parameterName = match[1], text = match[2];
            }
            var tag = { tagName: tagName };
            if (parameterName)
                tag.parameterName = parameterName;
            if (text)
                tag.text = text;
            tags.push(tag);
        }
        else {
            // Text without a preceding @tag on it is either the plain text
            // documentation or a continuation of a previous tag.
            if (tags.length === 0) {
                tags.push({ text: line.trim() });
            }
            else {
                tags[tags.length - 1].text += ' ' + line.trim();
            }
        }
    }
    if (warnings.length > 0) {
        return { tags: tags, warnings: warnings };
    }
    return { tags: tags };
}
exports.parse = parse;
/** Serializes a Comment out to a string usable in source code. */
function toString(tags) {
    var out = '';
    out += '/**\n';
    for (var _i = 0, tags_1 = tags; _i < tags_1.length; _i++) {
        var tag = tags_1[_i];
        out += ' * ';
        if (tag.tagName) {
            out += "@" + tag.tagName;
        }
        if (tag.type) {
            out += ' {';
            if (tag.restParam) {
                out += '...';
            }
            out += tag.type;
            if (tag.optional) {
                out += '=';
            }
            out += '}';
        }
        if (tag.parameterName) {
            out += ' ' + tag.parameterName;
        }
        if (tag.text) {
            out += ' ' + tag.text;
        }
        out += '\n';
    }
    out += ' */\n';
    return out;
}
exports.toString = toString;

//# sourceMappingURL=jsdoc.js.map
