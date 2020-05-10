import { Rule, SchematicContext, Tree, chain } from '@angular-devkit/schematics';
import {
  addPackageJsonDependency, NodeDependency, NodeDependencyType, getWorkspace,
  getProjectFromWorkspace, addModuleImportToRootModule
} from 'schematics-utilities';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';

export default function (_options: any): Rule {
  return chain([
    addPackageJsonDependencies(),
    installPackageJsonDependencies(),
    updateAngularJsonFile(),
    addModuleToAppModule()
  ]);
}

function addPackageJsonDependencies() {
  return (tree: Tree, context: SchematicContext) => {
    // Update package.json
    const dependencies: NodeDependency[] = [
      { type: NodeDependencyType.Default, version: '^3.4.1', name: 'jquery' },
      { type: NodeDependencyType.Default, version: '^1.10.20', name: 'datatables.net' },
      { type: NodeDependencyType.Default, version: '^1.10.20', name: 'datatables.net-dt' },
      { type: NodeDependencyType.Default, version: '^9.0.1', name: 'angular-datatables' },
      { type: NodeDependencyType.Dev, version: '^3.3.33', name: '@types/jquery' },
      { type: NodeDependencyType.Dev, version: '^1.10.18', name: '@types/datatables.net' }
    ];

    dependencies.forEach(dependency => {

      addPackageJsonDependency(tree, dependency);
      context.logger.log('info', `✅️ Added "${dependency.name}" into ${dependency.type}`);
    });
    return tree
  }
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
    try {
      const angularJsonFile = tree.read('angular.json');

      if (angularJsonFile) {
        const angularJsonFileObject = JSON.parse(angularJsonFile.toString('utf-8'));
        const project = Object.keys(angularJsonFileObject['projects'])[0];
        const projectObject = angularJsonFileObject.projects[project];
        const targets = projectObject.targets ? projectObject.targets : projectObject.architect;

        const styles = targets.build.options.styles;
        const scripts = targets.build.options.scripts;

        styles.push('node_modules/datatables.net-dt/css/jquery.dataTables.css');
        scripts.push('node_modules/jquery/dist/jquery.js');
        scripts.push('node_modules/datatables.net/js/jquery.dataTables.js');

        tree.overwrite('angular.json', JSON.stringify(angularJsonFileObject, null, 2));
        context.logger.log('info', `✅️ Updated angular.json`);
      } else {
        context.logger.log('error', '🚫 Failed to locate angular.json else.')
      }
    } catch (e) {
      context.logger.log('error', `🚫 Failed to update angular.json foobar.`);
    }

  }
}

function addModuleToAppModule(): Rule {
  return (host: Tree, context: SchematicContext) => {
    const moduleName = 'DataTablesModule';
    try {
      const workspace = getWorkspace(host);
      const project = getProjectFromWorkspace(
        workspace,
        Object.keys(workspace['projects'])[0]
      );
      addModuleImportToRootModule(host, moduleName, 'angular-datatables', project);
    } catch (e) {
      context.logger.log('error', `🚫 Failed to update app.module.ts`);
      return host;
    }
    context.logger.log('info', `✅️ "${moduleName}" is imported`);
    return host;
  }
}
