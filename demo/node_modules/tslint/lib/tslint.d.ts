import { findConfiguration, findConfigurationPath, getRulesDirectories, loadConfigurationFromPath } from "./configuration";
import { ILinterOptionsRaw, LintResult } from "./lint";
declare class Linter {
    static VERSION: string;
    static findConfiguration: typeof findConfiguration;
    static findConfigurationPath: typeof findConfigurationPath;
    static getRulesDirectories: typeof getRulesDirectories;
    static loadConfigurationFromPath: typeof loadConfigurationFromPath;
    private fileName;
    private source;
    private options;
    constructor(fileName: string, source: string, options: ILinterOptionsRaw);
    lint(): LintResult;
    private containsRule(rules, rule);
    private computeFullOptions(options?);
}
declare namespace Linter {
}
export = Linter;
