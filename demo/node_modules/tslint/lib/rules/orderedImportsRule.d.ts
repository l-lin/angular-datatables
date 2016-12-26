import * as Lint from "../lint";
import * as ts from "typescript";
export declare class Rule extends Lint.Rules.AbstractRule {
    static metadata: Lint.IRuleMetadata;
    static NAMED_IMPORTS_UNORDERED: string;
    static IMPORT_SOURCES_UNORDERED: string;
    apply(sourceFile: ts.SourceFile): Lint.RuleFailure[];
}
