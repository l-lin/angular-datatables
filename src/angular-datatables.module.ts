/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://raw.githubusercontent.com/l-lin/angular-datatables/master/LICENSE
 */

import { NgModule } from '@angular/core';
import { DataTableDirective } from './angular-datatables.directive';

@NgModule({
  declarations: [ DataTableDirective ],
  exports: [ DataTableDirective ]
})
export class DataTablesModule {}
