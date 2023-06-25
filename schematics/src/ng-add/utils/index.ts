/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import { Tree } from '@angular-devkit/schematics';

function sortObjectByKeys(obj: { [key: string]: string }) {
  return Object
    .keys(obj)
    .sort()
    /* tslint:disable-next-line: no-any */
    .reduce((result: any, key: any) => (
      result[key] = obj[key]
    ) && result, {});
}

/**
 * This function has been borrowed from:
 * https://github.com/valor-software/ngx-bootstrap/tree/development/schematics/src/utils/index.ts
 *
 * Note: This function accepts an additional parameter `isDevDependency` so we
 * can place a given dependency in the correct dependencies array inside package.json
 */
export function addPackageToPackageJson(host: Tree, pkg: string, version: string, isDevDependency = false): boolean {

  if (host.exists('package.json')) {
    /* tslint:disable-next-line: no-non-null-assertion */
    const sourceText = host.read('package.json')!.toString('utf-8');
    const json = JSON.parse(sourceText);

    if (!json.dependencies) {
      json.dependencies = {};
    }

    if (!json.devDependencies) {
      json.dependencies = {};
    }

    // update UI that `pkg` wasn't re-added to package.json
    if (json.dependencies[pkg] || json.devDependencies[pkg]) return false;

    if (!json.dependencies[pkg] && !isDevDependency) {
      json.dependencies[pkg] = version;
      json.dependencies = sortObjectByKeys(json.dependencies);
    }

    if (!json.devDependencies[pkg] && isDevDependency) {
      json.devDependencies[pkg] = version;
      json.devDependencies = sortObjectByKeys(json.devDependencies);
    }

    host.overwrite('package.json', JSON.stringify(json, null, 2));
    return true;
  }

  return false;
}

export function addAssetToAngularJson(host: Tree, assetType: string, assetPath: string): boolean {
  /* tslint:disable-next-line: no-non-null-assertion */
  const sourceText = host.read('angular.json')!.toString('utf-8');
  const json = JSON.parse(sourceText);

  if (!json) return false;

  const projectName = Object.keys(json['projects'])[0];
  const projectObject = json.projects[projectName];
  const targets = projectObject.targets || projectObject.architect;

  const targetLocation: string[] = targets.build.options[assetType];

  // update UI that `assetPath` wasn't re-added to angular.json
  if (targetLocation.indexOf(assetPath) != -1) return false;

  targetLocation.push(assetPath);

  host.overwrite('angular.json', JSON.stringify(json, null, 2));

  return true;

}
