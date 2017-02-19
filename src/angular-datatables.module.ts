/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://raw.githubusercontent.com/l-lin/angular-datatables/master/LICENSE
 */

import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTableDirective } from './angular-datatables.directive';

@NgModule({
  imports: [ CommonModule ],
  declarations: [ DataTableDirective ],
  exports: [ DataTableDirective ]
})
export class DataTablesModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: DataTablesModule
    };
  }
}
