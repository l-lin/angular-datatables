import * as ts from 'typescript';
export declare function assertTypeChecked(sourceFile: ts.SourceFile): void;
/**
 * Determines if fileName refers to a builtin lib.d.ts file.
 * This is a terrible hack but it mirrors a similar thing done in Clutz.
 */
export declare function isBuiltinLibDTS(fileName: string): boolean;
export declare function typeToDebugString(type: ts.Type): string;
export declare function symbolToDebugString(sym: ts.Symbol): string;
/** TypeTranslator translates TypeScript types to Closure types. */
export declare class TypeTranslator {
    private typeChecker;
    private node;
    private pathBlackList;
    /**
     * A list of types we've encountered while emitting; used to avoid getting stuck in recursive
     * types.
     */
    private seenTypes;
    /**
     * @param node is the source AST ts.Node the type comes from.  This is used
     *     in some cases (e.g. anonymous types) for looking up field names.
     * @param pathBlackList is a set of paths that should never get typed;
     *     any reference to symbols defined in these paths should by typed
     *     as {?}.
     */
    constructor(typeChecker: ts.TypeChecker, node: ts.Node, pathBlackList?: Set<string>);
    /**
     * Converts a ts.Symbol to a string.
     * Other approaches that don't work:
     * - TypeChecker.typeToString translates Array as T[].
     * - TypeChecker.symbolToString emits types without their namespace,
     *   and doesn't let you pass the flag to control that.
     */
    symbolToString(sym: ts.Symbol): string;
    /**
     * @param notNull When true, insert a ! before any type references.  This
     *    is to work around the difference between TS and Closure destructuring.
     */
    translate(type: ts.Type, notNull?: boolean): string;
    private translateTypeLiteral(type);
    /** Converts a ts.Signature (function signature) to a Closure function type. */
    private signatureToClosure(sig);
    warn(msg: string): void;
    /** @return true if sym should always have type {?}. */
    isBlackListed(symbol: ts.Symbol): boolean;
}
