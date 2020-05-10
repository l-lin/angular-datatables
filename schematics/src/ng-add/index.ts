import { Rule, SchematicContext, Tree, chain } from '@angular-devkit/schematics';
import { addPackageToPackageJson } from './utils';
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
      { version: '^9.0.1', name: 'angular-datatables', isDev: false },
      { version: '^3.3.33', name: '@types/jquery', isDev: true },
      { version: '^1.10.18', name: '@types/datatables.net', isDev: true }
    ];

    dependencies.forEach(dependency => {
      addPackageToPackageJson(tree, dependency.name, dependency.version, dependency.isDev)
      context.logger.log('info', `✅️ Added "${dependency.name}" into "${dependency.isDev ? "devDependencies" : "dependencies" }"`);
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
