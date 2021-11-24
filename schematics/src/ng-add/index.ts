import { Rule, SchematicContext, Tree, chain } from '@angular-devkit/schematics';
import { addAssetToAngularJson, addPackageToPackageJson } from './utils';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import { IADTSchematicsOptions } from './models/schematics-options';
import { ADT_SUPPORTED_STYLES, ADTStyleOptions } from './models/style-options';

export default function (_options: IADTSchematicsOptions): Rule {
  return chain([
    addPackageJsonDependencies(_options),
    installPackageJsonDependencies(),
    updateAngularJsonFile(_options)
  ]);
}

function addPackageJsonDependencies(options: IADTSchematicsOptions) {
  return (tree: Tree, context: SchematicContext) => {
    // Update package.json
    const styleDeps = ADT_SUPPORTED_STYLES.find(e => e.style == options.style);

    const dependencies = [
      { version: '^3.4.1', name: 'jquery', isDev: false },
      { version: '^1.10.20', name: 'datatables.net', isDev: false },
      { version: '^3.3.33', name: '@types/jquery', isDev: true },
      { version: '^1.10.18', name: '@types/datatables.net', isDev: true }
    ];

    if (styleDeps) {
      if (styleDeps.style != ADTStyleOptions.DT)
        context.logger.log('warn', 'Your project needs Bootstrap CSS installed and configured for changes to take affect.');
      styleDeps.packageJson.forEach(e => dependencies.push(e));
    }

    dependencies.forEach(dependency => {
      const result = addPackageToPackageJson(tree, dependency.name, dependency.version, dependency.isDev);
      if (result) {
        context.logger.log('info', `✅️ Added "${dependency.name}" into "${dependency.isDev ? 'devDependencies' : 'dependencies'}"`);
      } else {
        context.logger.log('info', `ℹ️  Skipped adding "${dependency.name}" into package.json`);
      }
    });
    return tree;
  };
}

function installPackageJsonDependencies(): Rule {
  return (host: Tree, context: SchematicContext) => {
    context.addTask(new NodePackageInstallTask());
    context.logger.log('info', `🔍 Installing packages...`);

    return host;
  };
}


function updateAngularJsonFile(options: IADTSchematicsOptions) {
  return (tree: Tree, context: SchematicContext) => {

    const styleDeps = ADT_SUPPORTED_STYLES.find(e => e.style == options.style);

    const assets = [
      { path: 'node_modules/jquery/dist/jquery.min.js', target: 'scripts', fancyName: 'jQuery Core' },
      { path: 'node_modules/datatables.net/js/jquery.dataTables.min.js', target: 'scripts', fancyName: 'DataTables.net Core JS' },
    ];

    if (styleDeps) {
      styleDeps.angularJson.forEach(e => assets.push(e));
    }

    assets.forEach(asset => {
      const result = addAssetToAngularJson(tree, asset.target, asset.path);
      if (result) {
        context.logger.log('info', `✅️ Added "${asset.fancyName}" into angular.json`);
      } else {
        context.logger.log('info', `ℹ️  Skipped adding "${asset.fancyName}" into angular.json`);
      }
    });
  };
}
