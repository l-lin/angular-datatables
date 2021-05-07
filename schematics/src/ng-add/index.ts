import { Rule, SchematicContext, Tree, chain } from '@angular-devkit/schematics';
import { addAssetToAngularJson, addPackageToPackageJson } from './utils';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';

export default function (_options: any): Rule {
  return chain([
    addPackageJsonDependencies(),
    installPackageJsonDependencies(),
    updateAngularJsonFile()
  ]);
}

function addPackageJsonDependencies() {
  return (tree: Tree, context: SchematicContext) => {
    // Update package.json
    const dependencies = [
      { version: '^3.4.1', name: 'jquery', isDev: false },
      { version: '^1.10.20', name: 'datatables.net', isDev: false },
      { version: '^1.10.20', name: 'datatables.net-dt', isDev: false },
      { version: '^11.0.0', name: 'angular-datatables', isDev: false },
      { version: '^3.3.33', name: '@types/jquery', isDev: true },
      { version: '^1.10.18', name: '@types/datatables.net', isDev: true }
    ];

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


function updateAngularJsonFile() {
  return (tree: Tree, context: SchematicContext) => {

    /**
     * @param path: asset path to be stored inside angular.json
     * @param target: specify whether asset is stylesheet or script file
     * @param fancyName: name to be displayed for asset on log
     */
    const assets = [
      { path: 'node_modules/datatables.net-dt/css/jquery.dataTables.css', target: 'styles', fancyName: 'DataTables.net Core CSS' },
      { path: 'node_modules/jquery/dist/jquery.js', target: 'scripts', fancyName: 'jQuery Core' },
      { path: 'node_modules/datatables.net/js/jquery.dataTables.js', target: 'scripts', fancyName: 'DataTables.net Core JS' },
    ];

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
