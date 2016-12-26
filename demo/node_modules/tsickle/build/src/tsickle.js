"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ts = require('typescript');
var jsdoc = require('./jsdoc');
var rewriter_1 = require('./rewriter');
var type_translator_1 = require('./type-translator');
var util_1 = require('./util');
var decorator_annotator_1 = require('./decorator-annotator');
exports.convertDecorators = decorator_annotator_1.convertDecorators;
var es5processor_1 = require('./es5processor');
exports.convertCommonJsToGoogModule = es5processor_1.processES5;
/**
 * Symbols that are already declared as externs in Closure, that should
 * be avoided by tsickle's "declare ..." => externs.js conversion.
 */
exports.closureExternsBlacklist = [
    'exports',
    'global',
    'module',
    'WorkerGlobalScope',
    'Symbol',
];
function formatDiagnostics(diags) {
    return diags
        .map(function (d) {
        var res = ts.DiagnosticCategory[d.category];
        if (d.file) {
            res += ' at ' + d.file.fileName + ':';
            var _a = d.file.getLineAndCharacterOfPosition(d.start), line = _a.line, character = _a.character;
            res += (line + 1) + ':' + (character + 1) + ':';
        }
        res += ' ' + ts.flattenDiagnosticMessageText(d.messageText, '\n');
        return res;
    })
        .join('\n');
}
exports.formatDiagnostics = formatDiagnostics;
var VISIBILITY_FLAGS = ts.NodeFlags.Private | ts.NodeFlags.Protected | ts.NodeFlags.Public;
/**
 * A Rewriter subclass that adds Tsickle-specific (Closure translation) functionality.
 *
 * One Rewriter subclass manages .ts => .ts+Closure translation.
 * Another Rewriter subclass manages .ts => externs translation.
 */
var ClosureRewriter = (function (_super) {
    __extends(ClosureRewriter, _super);
    function ClosureRewriter(program, file, options) {
        _super.call(this, file);
        this.program = program;
        this.options = options;
    }
    ClosureRewriter.prototype.emitFunctionType = function (fnDecl, extraTags) {
        if (extraTags === void 0) { extraTags = []; }
        var typeChecker = this.program.getTypeChecker();
        var sig = typeChecker.getSignatureFromDeclaration(fnDecl);
        // Construct the JSDoc comment by reading the existing JSDoc, if
        // any, and merging it with the known types of the function
        // parameters and return type.
        var jsDoc = this.getJSDoc(fnDecl) || [];
        var newDoc = extraTags;
        // Copy all the tags other than @param/@return into the new
        // comment without any change; @param/@return are handled later.
        for (var _i = 0, jsDoc_1 = jsDoc; _i < jsDoc_1.length; _i++) {
            var tag = jsDoc_1[_i];
            if (tag.tagName === 'param' || tag.tagName === 'return')
                continue;
            newDoc.push(tag);
        }
        // Abstract
        if ((fnDecl.flags & ts.NodeFlags.Abstract)) {
            newDoc.push({ tagName: 'abstract' });
        }
        // Parameters.
        if (sig.parameters.length) {
            // Iterate through both the AST parameter list and the type's parameter
            // list, as some information is only available in the former.
            for (var i = 0; i < sig.parameters.length; i++) {
                var paramNode = fnDecl.parameters[i];
                var paramSym = sig.parameters[i];
                var type = typeChecker.getTypeOfSymbolAtLocation(paramSym, fnDecl);
                var newTag = {
                    tagName: 'param',
                    optional: paramNode.initializer !== undefined || paramNode.questionToken !== undefined,
                    parameterName: rewriter_1.unescapeName(paramSym.getName()),
                };
                var destructuring = (paramNode.name.kind === ts.SyntaxKind.ArrayBindingPattern ||
                    paramNode.name.kind === ts.SyntaxKind.ObjectBindingPattern);
                if (paramNode.dotDotDotToken !== undefined) {
                    newTag.restParam = true;
                    // In TypeScript you write "...x: number[]", but in Closure
                    // you don't write the array: "@param {...number} x".  Unwrap
                    // the Array<> wrapper.
                    type = type.typeArguments[0];
                }
                newTag.type = this.typeToClosure(fnDecl, type, destructuring);
                // Search for this parameter in the JSDoc @params.
                for (var _a = 0, jsDoc_2 = jsDoc; _a < jsDoc_2.length; _a++) {
                    var _b = jsDoc_2[_a], tagName = _b.tagName, parameterName = _b.parameterName, text = _b.text;
                    if (tagName === 'param' && parameterName === newTag.parameterName) {
                        newTag.text = text;
                        break;
                    }
                }
                newDoc.push(newTag);
            }
        }
        // Return type.
        if (fnDecl.kind !== ts.SyntaxKind.Constructor) {
            var retType = typeChecker.getReturnTypeOfSignature(sig);
            var returnDoc = void 0;
            for (var _c = 0, jsDoc_3 = jsDoc; _c < jsDoc_3.length; _c++) {
                var _d = jsDoc_3[_c], tagName = _d.tagName, text = _d.text;
                if (tagName === 'return') {
                    returnDoc = text;
                    break;
                }
            }
            newDoc.push({
                tagName: 'return',
                type: this.typeToClosure(fnDecl, retType),
                text: returnDoc,
            });
        }
        // The first \n makes the output sometimes uglier than necessary,
        // but it's needed to work around
        // https://github.com/Microsoft/TypeScript/issues/6982
        this.emit('\n' + jsdoc.toString(newDoc));
    };
    /**
     * Returns null if there is no existing comment.
     */
    ClosureRewriter.prototype.getJSDoc = function (node) {
        var text = node.getFullText();
        var comments = ts.getLeadingCommentRanges(text, 0);
        if (!comments || comments.length === 0)
            return null;
        // JS compiler only considers the last comment significant.
        var _a = comments[comments.length - 1], pos = _a.pos, end = _a.end;
        var comment = text.substring(pos, end);
        var parsed = jsdoc.parse(comment);
        if (!parsed)
            return null;
        if (parsed.warnings) {
            var start = node.getFullStart() + pos;
            this.diagnostics.push({
                file: this.file,
                start: start,
                length: node.getStart() - start,
                messageText: parsed.warnings.join('\n'),
                category: ts.DiagnosticCategory.Warning,
                code: 0,
            });
        }
        return parsed.tags;
    };
    /** Emits a type annotation in JSDoc, or {?} if the type is unavailable. */
    ClosureRewriter.prototype.emitJSDocType = function (node, additionalDocTag) {
        this.emit(' /**');
        if (additionalDocTag) {
            this.emit(' ' + additionalDocTag);
        }
        this.emit(" @type {" + this.typeToClosure(node) + "} */");
    };
    /**
     * Convert a TypeScript ts.Type into the equivalent Closure type.
     *
     * @param context The ts.Node containing the type reference; used for resolving symbols
     *     in context.
     * @param type The type to translate; if not provided, the Node's type will be used.
     * @param destructuring If true, insert a Closure "!" (not-null annotation) on all
     *     object/array types.  This is a workaround specifically for destructuring
     *     bind patterns.
     */
    ClosureRewriter.prototype.typeToClosure = function (context, type, destructuring) {
        var _this = this;
        if (this.options.untyped) {
            return '?';
        }
        var typeChecker = this.program.getTypeChecker();
        if (!type) {
            type = typeChecker.getTypeAtLocation(context);
        }
        var translator = new type_translator_1.TypeTranslator(typeChecker, context, this.options.typeBlackListPaths);
        translator.warn = function (msg) { return _this.debugWarn(context, msg); };
        return translator.translate(type, destructuring);
    };
    /**
     * debug logs a debug warning.  These should only be used for cases
     * where tsickle is making a questionable judgement about what to do.
     * By default, tsickle does not report any warnings to the caller,
     * and warnings are hidden behind a debug flag, as warnings are only
     * for tsickle to debug itself.
     */
    ClosureRewriter.prototype.debugWarn = function (node, messageText) {
        if (!this.options.logWarning)
            return;
        // Use a ts.Diagnosic so that the warning includes context and file offets.
        var diagnostic = {
            file: this.file,
            start: node.getStart(),
            length: node.getEnd() - node.getStart(), messageText: messageText,
            category: ts.DiagnosticCategory.Warning,
            code: 0,
        };
        this.options.logWarning(diagnostic);
    };
    return ClosureRewriter;
}(rewriter_1.Rewriter));
/** Annotator translates a .ts to a .ts with Closure annotations. */
var Annotator = (function (_super) {
    __extends(Annotator, _super);
    function Annotator(program, file, options) {
        _super.call(this, program, file, options);
        /** Exported symbol names that have been generated by expanding an "export * from ...". */
        this.generatedExports = new Set();
        this.externsWriter = new ExternsWriter(program, file, options);
    }
    Annotator.prototype.annotate = function () {
        this.visit(this.file);
        var externs = this.externsWriter.getOutput();
        var annotated = this.getOutput();
        var externsSource = null;
        if (externs.output) {
            externsSource = "/** @externs */\n// NOTE: generated by tsickle, do not edit.\n" + externs.output;
        }
        return {
            output: annotated.output,
            externs: externsSource,
            diagnostics: externs.diagnostics.concat(annotated.diagnostics),
        };
    };
    /**
     * Examines a ts.Node and decides whether to do special processing of it for output.
     *
     * @return True if the ts.Node has been handled, false if we should
     *     emit it as is and visit its children.
     */
    Annotator.prototype.maybeProcess = function (node) {
        if (node.flags & ts.NodeFlags.Ambient) {
            this.externsWriter.visit(node);
            // An ambient declaration declares types for TypeScript's benefit, so we want to skip Tsickle
            // conversion of its contents.
            this.writeRange(node.getFullStart(), node.getEnd());
            return true;
        }
        switch (node.kind) {
            case ts.SyntaxKind.ImportDeclaration:
                return this.emitImportDeclaration(node);
            case ts.SyntaxKind.ExportDeclaration:
                var exportDecl = node;
                if (!exportDecl.exportClause && exportDecl.moduleSpecifier) {
                    // It's an "export * from ..." statement.
                    // Rewrite it to re-export each exported symbol directly.
                    var exports_1 = this.expandSymbolsFromExportStar(exportDecl);
                    this.writeRange(exportDecl.getFullStart(), exportDecl.getStart());
                    this.emit("export {" + exports_1.join(',') + "} from");
                    this.writeRange(exportDecl.moduleSpecifier.getFullStart(), node.getEnd());
                    return true;
                }
                return false;
            case ts.SyntaxKind.InterfaceDeclaration:
                this.emitInterface(node);
                // Emit the TS interface verbatim, with no tsickle processing of properties.
                this.writeRange(node.getFullStart(), node.getEnd());
                return true;
            case ts.SyntaxKind.VariableDeclaration:
                var varDecl = node;
                // Only emit a type annotation when it's a plain variable and
                // not a binding pattern, as Closure doesn't(?) have a syntax
                // for annotating binding patterns.  See issue #128.
                if (varDecl.name.kind === ts.SyntaxKind.Identifier) {
                    this.emitJSDocType(varDecl);
                }
                return false;
            case ts.SyntaxKind.ClassDeclaration:
                var classNode = node;
                if (classNode.members.length > 0) {
                    // We must visit all members individually, to strip out any
                    // /** @export */ annotations that show up in the constructor
                    // and to annotate methods.
                    this.writeRange(classNode.getFullStart(), classNode.members[0].getFullStart());
                    for (var _i = 0, _a = classNode.members; _i < _a.length; _i++) {
                        var member = _a[_i];
                        this.visit(member);
                    }
                }
                else {
                    this.writeRange(classNode.getFullStart(), classNode.getLastToken().getFullStart());
                }
                this.emitTypeAnnotationsHelper(classNode);
                this.writeNode(classNode.getLastToken());
                return true;
            case ts.SyntaxKind.PublicKeyword:
            case ts.SyntaxKind.PrivateKeyword:
                // The "public"/"private" keywords are encountered in two places:
                // 1) In class fields (which don't appear in the transformed output).
                // 2) In "parameter properties", e.g.
                //      constructor(/** @export */ public foo: string).
                // In case 2 it's important to not emit that JSDoc in the generated
                // constructor, as this is illegal for Closure.  It's safe to just
                // always skip comments preceding the 'public' keyword.
                // See test_files/parameter_properties.ts.
                this.writeNode(node, /* skipComments */ true);
                return true;
            case ts.SyntaxKind.Constructor:
                var ctor = node;
                this.emitFunctionType(ctor);
                // Write the "constructor(...) {" bit, but iterate through any
                // parameters if given so that we can examine them more closely.
                var offset = ctor.getStart();
                if (ctor.parameters.length) {
                    for (var _b = 0, _c = ctor.parameters; _b < _c.length; _b++) {
                        var param = _c[_b];
                        this.writeRange(offset, param.getFullStart());
                        this.visit(param);
                        offset = param.getEnd();
                    }
                }
                this.writeRange(offset, node.getEnd());
                return true;
            case ts.SyntaxKind.ArrowFunction:
                // It's difficult to annotate arrow functions due to a bug in
                // TypeScript (see tsickle issue 57).  For now, just pass them
                // through unannotated.
                return false;
            case ts.SyntaxKind.FunctionDeclaration:
            case ts.SyntaxKind.MethodDeclaration:
                var fnDecl = node;
                if (!fnDecl.body) {
                    if ((fnDecl.flags & ts.NodeFlags.Abstract) !== 0) {
                        this.emitFunctionType(fnDecl);
                        // Abstract functions look like
                        //   abstract foo();
                        // Emit the function as normal, except:
                        // - remove the "abstract"
                        // - change the return type to "void"
                        // - replace the trailing semicolon with an empty block {}
                        // To do so, skip all modifiers before the function name, and
                        // emit up to the end of the parameter list / return type.
                        if (!fnDecl.name) {
                            // Can you even have an unnamed abstract function?
                            this.error(fnDecl, 'anonymous abstract function');
                            return false;
                        }
                        this.writeRange(fnDecl.name.getStart(), fnDecl.parameters.end);
                        this.emit(') {}');
                        return true;
                    }
                    // Functions are allowed to not have bodies in the presence
                    // of overloads.  It's not clear how to translate these overloads
                    // into Closure types, so skip them for now.
                    return false;
                }
                this.emitFunctionType(fnDecl);
                this.writeRange(fnDecl.getStart(), fnDecl.body.getFullStart());
                this.visit(fnDecl.body);
                return true;
            case ts.SyntaxKind.TypeAliasDeclaration:
                this.writeNode(node);
                this.visitTypeAlias(node);
                return true;
            case ts.SyntaxKind.EnumDeclaration:
                return this.maybeProcessEnum(node);
            case ts.SyntaxKind.TypeAssertionExpression:
            case ts.SyntaxKind.AsExpression:
                // Both of these cases are AssertionExpressions.
                var typeAssertion = node;
                this.emitJSDocType(typeAssertion);
                // When TypeScript emits JS, it removes one layer of "redundant"
                // parens, but we need them for the Closure type assertion.  Work
                // around this by using two parens.  See test_files/coerce.*.
                this.emit('((');
                this.writeNode(node);
                this.emit('))');
                return true;
            default:
                break;
        }
        return false;
    };
    /**
     * Given a "export * from ..." statement, gathers the symbol names it actually
     * exports to be used in a statement like "export {foo, bar, baz} from ...".
     *
     * This is necessary because TS transpiles "export *" by just doing a runtime loop
     * over the target module's exports, which means Closure won't see the declarations/types
     * that are exported.
     */
    Annotator.prototype.expandSymbolsFromExportStar = function (exportDecl) {
        // You can't have an "export *" without a module specifier.
        var moduleSpecifier = exportDecl.moduleSpecifier;
        var typeChecker = this.program.getTypeChecker();
        // Gather the names of local exports, to avoid reexporting any
        // names that are already locally exported.
        // To find symbols declared like
        //   export {foo} from ...
        // we must also query for "Alias", but that unfortunately also brings in
        //   import {foo} from ...
        // so the latter is filtered below.
        var locals = typeChecker.getSymbolsInScope(this.file, ts.SymbolFlags.Export | ts.SymbolFlags.Alias);
        var localSet = new Set();
        for (var _i = 0, locals_1 = locals; _i < locals_1.length; _i++) {
            var local = locals_1[_i];
            if (local.declarations &&
                local.declarations.some(function (d) { return d.kind === ts.SyntaxKind.ImportSpecifier; })) {
                continue;
            }
            localSet.add(local.name);
        }
        // Expand the export list, then filter it to the symbols we want to reexport.
        var exports = typeChecker.getExportsOfModule(typeChecker.getSymbolAtLocation(moduleSpecifier));
        var reexports = new Set();
        for (var _a = 0, exports_2 = exports; _a < exports_2.length; _a++) {
            var sym = exports_2[_a];
            var name_1 = rewriter_1.unescapeName(sym.name);
            if (localSet.has(name_1)) {
                // This name is shadowed by a local definition, such as:
                // - export var foo ...
                // - export {foo} from ...
                continue;
            }
            if (this.generatedExports.has(name_1)) {
                // Already exported via an earlier expansion of an "export * from ...".
                continue;
            }
            this.generatedExports.add(name_1);
            reexports.add(name_1);
        }
        return util_1.toArray(reexports.keys());
    };
    /**
     * Handles emit of an "import ..." statement.
     * We need to do a bit of rewriting so that imported types show up under the
     * correct name in JSDoc.
     * @return true if the decl was handled, false to allow default processing.
     */
    Annotator.prototype.emitImportDeclaration = function (decl) {
        if (this.options.untyped)
            return false;
        var importClause = decl.importClause;
        if (!importClause) {
            // import './foo';
            return false; // Use default processing.
        }
        else if (importClause.name || (importClause.namedBindings &&
            importClause.namedBindings.kind === ts.SyntaxKind.NamedImports)) {
            // importClause.name implies
            //   import a from ...;
            // namedBindings being NamedImports implies
            //   import {a as b} from ...;
            //
            // Both of these forms create a local name "a", which after
            // TypeScript CommonJS compilation will become some renamed
            // variable like "module_1.a".  But a user might still use plain
            // "a" in some JSDoc comment, so gather up these local names for
            // imports and make an alias for each for JSDoc purposes.
            var localNames = void 0;
            if (importClause.name) {
                // import a from ...;
                localNames = [rewriter_1.getIdentifierText(importClause.name)];
            }
            else {
                // import {a as b} from ...;
                var namedImports = importClause.namedBindings;
                localNames = namedImports.elements.map(function (imp) { return rewriter_1.getIdentifierText(imp.name); });
            }
            this.writeNode(decl);
            for (var _i = 0, localNames_1 = localNames; _i < localNames_1.length; _i++) {
                var name_2 = localNames_1[_i];
                // This may look like a self-reference but TypeScript will rename the
                // right-hand side!
                this.emit("\nconst " + name_2 + ": NeverTypeCheckMe = " + name_2 + ";  /* local alias for Closure JSDoc */");
            }
            return true;
        }
        else if (importClause.namedBindings &&
            importClause.namedBindings.kind === ts.SyntaxKind.NamespaceImport) {
            // import * as foo from ...;
            return false; // Use default processing.
        }
        else {
            this.errorUnimplementedKind(decl, 'unexpected kind of import');
            return false; // Use default processing.
        }
    };
    Annotator.prototype.emitInterface = function (iface) {
        if (this.options.untyped)
            return;
        // If this symbol is both a type and a value, we cannot emit both into Closure's
        // single namespace.
        var sym = this.program.getTypeChecker().getSymbolAtLocation(iface.name);
        if (sym.flags & ts.SymbolFlags.Value)
            return;
        this.emit("\n/** @record */\n");
        if (iface.flags & ts.NodeFlags.Export)
            this.emit('export ');
        var name = rewriter_1.getIdentifierText(iface.name);
        this.emit("function " + name + "() {}\n");
        if (iface.typeParameters) {
            this.emit("// TODO: type parameters.\n");
        }
        if (iface.heritageClauses) {
            this.emit("// TODO: derived interfaces.\n");
        }
        var memberNamespace = [name, 'prototype'];
        for (var _i = 0, _a = iface.members; _i < _a.length; _i++) {
            var elem = _a[_i];
            this.visitProperty(memberNamespace, elem);
        }
    };
    // emitTypeAnnotationsHelper produces a
    // _tsickle_typeAnnotationsHelper() where none existed in the
    // original source.  It's necessary in the case where TypeScript
    // syntax specifies there are additional properties on the class,
    // because to declare these in Closure you must declare these in a
    // method somewhere.
    Annotator.prototype.emitTypeAnnotationsHelper = function (classDecl) {
        var _this = this;
        // Gather parameter properties from the constructor, if it exists.
        var ctors = [];
        var paramProps = [];
        var nonStaticProps = [];
        var staticProps = [];
        for (var _i = 0, _a = classDecl.members; _i < _a.length; _i++) {
            var member = _a[_i];
            if (member.kind === ts.SyntaxKind.Constructor) {
                ctors.push(member);
            }
            else if (member.kind === ts.SyntaxKind.PropertyDeclaration) {
                var prop = member;
                var isStatic = (prop.flags & ts.NodeFlags.Static) !== 0;
                if (isStatic) {
                    staticProps.push(prop);
                }
                else {
                    nonStaticProps.push(prop);
                }
            }
        }
        if (ctors.length > 0) {
            var ctor = ctors[0];
            paramProps = ctor.parameters.filter(function (p) { return !!(p.flags & VISIBILITY_FLAGS); });
        }
        if (nonStaticProps.length === 0 && paramProps.length === 0 && staticProps.length === 0) {
            // There are no members so we don't need to emit any type
            // annotations helper.
            return;
        }
        if (!classDecl.name)
            return;
        var className = rewriter_1.getIdentifierText(classDecl.name);
        this.emit('\n\n  static _tsickle_typeAnnotationsHelper() {\n');
        staticProps.forEach(function (p) { return _this.visitProperty([className], p); });
        var memberNamespace = [className, 'prototype'];
        nonStaticProps.forEach(function (p) { return _this.visitProperty(memberNamespace, p); });
        paramProps.forEach(function (p) { return _this.visitProperty(memberNamespace, p); });
        this.emit('  }\n');
    };
    Annotator.prototype.propertyName = function (prop) {
        if (!prop.name)
            return null;
        switch (prop.name.kind) {
            case ts.SyntaxKind.Identifier:
                return rewriter_1.getIdentifierText(prop.name);
            case ts.SyntaxKind.StringLiteral:
                // E.g. interface Foo { 'bar': number; }
                // If 'bar' is a name that is not valid in Closure then there's nothing we can do.
                return prop.name.text;
            default:
                return null;
        }
    };
    Annotator.prototype.visitProperty = function (namespace, p) {
        var name = this.propertyName(p);
        if (!name) {
            this.emit("/* TODO: handle strange member:\n" + this.escapeForComment(p.getText()) + "\n*/\n");
            return;
        }
        var jsDoc = this.getJSDoc(p) || [];
        var existingAnnotation = '';
        for (var _i = 0, jsDoc_4 = jsDoc; _i < jsDoc_4.length; _i++) {
            var _a = jsDoc_4[_i], tagName = _a.tagName, text = _a.text;
            if (tagName) {
                existingAnnotation += "@" + tagName + "\n";
            }
            else {
                existingAnnotation += text + "\n";
            }
        }
        this.emit(' /**');
        if (existingAnnotation) {
            this.emit(' ' + existingAnnotation);
        }
        this.emit(" @type {" + this.typeToClosure(p) + "} */\n");
        namespace = namespace.concat([name]);
        this.emit(namespace.join('.') + ";\n");
    };
    Annotator.prototype.visitTypeAlias = function (node) {
        if (this.options.untyped)
            return;
        // Write a Closure typedef, which involves an unused "var" declaration.
        this.emit("\n/** @typedef {" + this.typeToClosure(node) + "} */\n");
        if (node.flags & ts.NodeFlags.Export)
            this.emit('export ');
        this.emit("var " + node.name.getText() + ": void;\n");
    };
    /** Processes an EnumDeclaration or returns false for ordinary processing. */
    Annotator.prototype.maybeProcessEnum = function (node) {
        if (node.flags & ts.NodeFlags.Const) {
            // const enums disappear after TS compilation and consequently need no
            // help from tsickle.
            return false;
        }
        // Gather the members of enum, saving the constant value or
        // initializer expression in the case of a non-constant value.
        var members = new Map();
        var i = 0;
        for (var _i = 0, _a = node.members; _i < _a.length; _i++) {
            var member = _a[_i];
            var memberName = member.name.getText();
            if (member.initializer) {
                var enumConstValue = this.program.getTypeChecker().getConstantValue(member);
                if (enumConstValue !== undefined) {
                    members.set(memberName, enumConstValue);
                    i = enumConstValue + 1;
                }
                else {
                    // Non-constant enum value.  Save the initializer expression for
                    // emitting as-is.
                    // Note: if the member's initializer expression refers to another
                    // value within the enum (e.g. something like
                    //   enum Foo {
                    //     Field1,
                    //     Field2 = Field1 + something(),
                    //   }
                    // Then when we emit the initializer we produce invalid code because
                    // on the Closure side it has to be written "Foo.Field1 + something()".
                    // Hopefully this doesn't come up often -- if the enum instead has
                    // something like
                    //     Field2 = Field1 + 3,
                    // then it's still a constant expression and we inline the constant
                    // value in the above branch of this "if" statement.
                    members.set(memberName, member.initializer);
                }
            }
            else {
                members.set(memberName, i);
                i++;
            }
        }
        // Emit the enum declaration, which looks like:
        //   type Foo = number;
        //   let Foo: any = {};
        // We use an "any" here rather than a more specific type because
        // we think TypeScript has already checked types for us, and it's
        // a bit difficult to provide a type that matches all the interfaces
        // expected of an enum (in particular, it is keyable both by
        // string and number).
        // We don't emit a specific Closure type for the enum because it's
        // also difficult to make work: for example, we can't make the name
        // both a typedef and an indexable object if we export it.
        this.emit('\n');
        var name = node.name.getText();
        if (node.flags & ts.NodeFlags.Export) {
            this.emit('export ');
        }
        this.emit("type " + name + " = number;\n");
        if (node.flags & ts.NodeFlags.Export) {
            this.emit('export ');
        }
        this.emit("let " + name + ": any = {};\n");
        // Emit foo.BAR = 0; lines.
        for (var _b = 0, _c = util_1.toArray(members.keys()); _b < _c.length; _b++) {
            var member = _c[_b];
            if (!this.options.untyped)
                this.emit("/** @type {number} */\n");
            this.emit(name + "." + member + " = ");
            var value = members.get(member);
            if (typeof value === 'number') {
                this.emit(value.toString());
            }
            else {
                this.visit(value);
            }
            this.emit(';\n');
        }
        // Emit foo[foo.BAR] = 'BAR'; lines.
        for (var _d = 0, _e = util_1.toArray(members.keys()); _d < _e.length; _d++) {
            var member = _e[_d];
            this.emit(name + "[" + name + "." + member + "] = \"" + member + "\";\n");
        }
        return true;
    };
    return Annotator;
}(ClosureRewriter));
/** ExternsWriter generates Closure externs from TypeScript source. */
var ExternsWriter = (function (_super) {
    __extends(ExternsWriter, _super);
    function ExternsWriter() {
        _super.apply(this, arguments);
    }
    /** visit is the main entry point.  It generates externs from a ts.Node. */
    ExternsWriter.prototype.visit = function (node, namespace) {
        if (namespace === void 0) { namespace = []; }
        switch (node.kind) {
            case ts.SyntaxKind.ModuleDeclaration:
                var decl = node;
                switch (decl.name.kind) {
                    case ts.SyntaxKind.Identifier:
                        // E.g. "declare namespace foo {"
                        var name_3 = rewriter_1.getIdentifierText(decl.name);
                        if (name_3 === undefined)
                            break;
                        namespace = namespace.concat(name_3);
                        if (this.isFirstDeclaration(decl)) {
                            this.emit('/** @const */\n');
                            if (namespace.length > 1) {
                                this.emit(namespace.join('.') + " = {};\n");
                            }
                            else {
                                this.emit("var " + namespace + " = {};\n");
                            }
                        }
                        if (decl.body)
                            this.visit(decl.body, namespace);
                        break;
                    case ts.SyntaxKind.StringLiteral:
                        // E.g. "declare module 'foo' {" (note the quotes).
                        // Skip it.
                        break;
                    default:
                        this.errorUnimplementedKind(decl.name, 'externs generation of namespace');
                }
                break;
            case ts.SyntaxKind.ModuleBlock:
                var block = node;
                for (var _i = 0, _a = block.statements; _i < _a.length; _i++) {
                    var stmt = _a[_i];
                    this.visit(stmt, namespace);
                }
                break;
            case ts.SyntaxKind.ClassDeclaration:
            case ts.SyntaxKind.InterfaceDeclaration:
                this.writeExternsType(node, namespace);
                break;
            case ts.SyntaxKind.FunctionDeclaration:
                var f = node;
                var name_4 = f.name;
                if (!name_4) {
                    this.error(f, 'anonymous function in externs');
                    break;
                }
                this.emitFunctionType(f);
                var params = f.parameters.map(function (p) { return p.name.getText(); });
                this.writeExternsFunction(name_4.getText(), params.join(', '), namespace);
                break;
            case ts.SyntaxKind.VariableStatement:
                for (var _b = 0, _c = node.declarationList.declarations; _b < _c.length; _b++) {
                    var decl_1 = _c[_b];
                    this.writeExternsVariable(decl_1, namespace);
                }
                break;
            case ts.SyntaxKind.EnumDeclaration:
                this.writeExternsEnum(node, namespace);
                break;
            default:
                this.emit("\n/* TODO: " + ts.SyntaxKind[node.kind] + " in " + namespace.join('.') + " */\n");
                break;
        }
    };
    /**
     * isFirstDeclaration returns true if decl is the first declaration
     * of its symbol.  E.g. imagine
     *   interface Foo { x: number; }
     *   interface Foo { y: number; }
     * we only want to emit the "@record" for Foo on the first one.
     */
    ExternsWriter.prototype.isFirstDeclaration = function (decl) {
        if (!decl.name)
            return true;
        var typeChecker = this.program.getTypeChecker();
        var sym = typeChecker.getSymbolAtLocation(decl.name);
        if (!sym.declarations || sym.declarations.length < 2)
            return true;
        return decl === sym.declarations[0];
    };
    ExternsWriter.prototype.writeExternsType = function (decl, namespace) {
        var name = decl.name;
        if (!name) {
            this.error(decl, 'anonymous type in externs');
            return;
        }
        var typeName = namespace.concat([name.getText()]).join('.');
        if (exports.closureExternsBlacklist.indexOf(typeName) >= 0)
            return;
        if (this.isFirstDeclaration(decl)) {
            var paramNames = '';
            if (decl.kind === ts.SyntaxKind.ClassDeclaration) {
                var ctors = decl.members.filter(function (m) { return m.kind === ts.SyntaxKind.Constructor; });
                if (ctors.length) {
                    if (ctors.length > 1) {
                        // TODO: unify the multiple constructors as overloads.
                        // For now, we just drop all but the first.
                        // See https://github.com/angular/tsickle/issues/180 .
                        this.debugWarn(ctors[1], 'multiple constructor signatures in declarations');
                    }
                    var ctor = ctors[0];
                    this.emitFunctionType(ctor, [{ tagName: 'constructor' }, { tagName: 'struct' }]);
                    paramNames = ctor.parameters.map(function (p) { return p.name.getText(); }).join(', ');
                }
                else {
                    this.emit('/** @constructor @struct */\n');
                }
            }
            else {
                this.emit('/** @record @struct */\n');
            }
            this.writeExternsFunction(name.getText(), paramNames, namespace);
        }
        for (var _i = 0, _a = decl.members; _i < _a.length; _i++) {
            var member = _a[_i];
            switch (member.kind) {
                case ts.SyntaxKind.PropertySignature:
                case ts.SyntaxKind.PropertyDeclaration:
                    var prop = member;
                    if (prop.name.kind === ts.SyntaxKind.Identifier) {
                        this.emitJSDocType(prop);
                        this.emit("\n" + typeName + ".prototype." + prop.name.getText() + ";\n");
                        continue;
                    }
                    // TODO: For now property names other than Identifiers are not handled; e.g.
                    //    interface Foo { "123bar": number }
                    break;
                case ts.SyntaxKind.MethodSignature:
                case ts.SyntaxKind.MethodDeclaration:
                    var m = member;
                    this.emitFunctionType(m);
                    this.emit((typeName + ".prototype." + m.name.getText() + " = ") +
                        ("function(" + m.parameters.map(function (p) { return p.name.getText(); }).join(', ') + ") {};\n"));
                    continue;
                case ts.SyntaxKind.Constructor:
                    continue; // Handled above.
                default:
                    // Members can include things like index signatures, for e.g.
                    //   interface Foo { [key: string]: number; }
                    // For now, just skip it.
                    break;
            }
            // If we get here, the member wasn't handled in the switch statement.
            var memberName = namespace;
            if (member.name) {
                memberName = memberName.concat([member.name.getText()]);
            }
            this.emit("\n/* TODO: " + ts.SyntaxKind[member.kind] + ": " + memberName.join('.') + " */\n");
        }
    };
    ExternsWriter.prototype.writeExternsVariable = function (decl, namespace) {
        if (decl.name.kind === ts.SyntaxKind.Identifier) {
            var identifier = decl.name;
            var qualifiedName = namespace.concat([rewriter_1.getIdentifierText(identifier)]).join('.');
            if (exports.closureExternsBlacklist.indexOf(qualifiedName) >= 0)
                return;
            this.emitJSDocType(decl);
            if (namespace.length > 0) {
                this.emit("\n" + qualifiedName + ";\n");
            }
            else {
                this.emit("\nvar " + qualifiedName + ";\n");
            }
        }
        else {
            this.errorUnimplementedKind(decl.name, 'externs for variable');
        }
    };
    ExternsWriter.prototype.writeExternsFunction = function (name, params, namespace) {
        if (namespace.length > 0) {
            name = namespace.concat([name]).join('.');
            this.emit(name + " = function(" + params + ") {};\n");
        }
        else {
            this.emit("function " + name + "(" + params + ") {}\n");
        }
    };
    ExternsWriter.prototype.writeExternsEnum = function (decl, namespace) {
        namespace = namespace.concat([rewriter_1.getIdentifierText(decl.name)]);
        this.emit('\n/** @const */\n');
        this.emit(namespace.join('.') + " = {};\n");
        for (var _i = 0, _a = decl.members; _i < _a.length; _i++) {
            var member = _a[_i];
            var memberName = member.name.getText();
            var name_5 = namespace.concat([memberName]).join('.');
            this.emit('/** @const {number} */\n');
            this.emit(name_5 + ";\n");
        }
    };
    return ExternsWriter;
}(ClosureRewriter));
function annotate(program, file, options) {
    if (options === void 0) { options = {}; }
    type_translator_1.assertTypeChecked(file);
    return new Annotator(program, file, options).annotate();
}
exports.annotate = annotate;

//# sourceMappingURL=tsickle.js.map
