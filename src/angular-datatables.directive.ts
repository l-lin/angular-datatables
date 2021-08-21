/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://raw.githubusercontent.com/l-lin/angular-datatables/master/LICENSE
 */

import { Directive, ElementRef, Input, OnDestroy, OnInit, Renderer2, ViewContainerRef } from '@angular/core';
import { Subject } from 'rxjs';
import { ADTSettings, ADTColumns } from './models/settings';

@Directive({
  selector: '[datatable]'
})
export class DataTableDirective implements OnDestroy, OnInit {
  /**
   * The DataTable option you pass to configure your table.
   */
  @Input()
  dtOptions: ADTSettings = {};

  /**
   * This trigger is used if one wants to trigger manually the DT rendering
   * Useful when rendering angular rendered DOM
   */
  @Input()
  dtTrigger: Subject<ADTSettings>;

  /**
   * The DataTable instance built by the jQuery library [DataTables](datatables.net).
   *
   * It's possible to execute the [DataTables APIs](https://datatables.net/reference/api/) with
   * this variable.
   */
  dtInstance: Promise<DataTables.Api>;

  // Only used for destroying the table when destroying this directive
  private dt: DataTables.Api;

  constructor(
    private el: ElementRef,
    private vcr: ViewContainerRef,
    private renderer: Renderer2
  ) { }

  ngOnInit(): void {
    if (this.dtTrigger) {
      this.dtTrigger.subscribe((options) => {
        this.displayTable(options);
      });
    } else {
      this.displayTable(null);
    }
  }

  ngOnDestroy(): void {
    if (this.dtTrigger) {
      this.dtTrigger.unsubscribe();
    }
    if (this.dt) {
      this.dt.destroy(true);
    }
  }

  private displayTable(dtOptions: ADTSettings): void {
    const self = this;
    // assign new options if provided
    if (dtOptions) {
      this.dtOptions = dtOptions;
    }
    this.dtInstance = new Promise((resolve, reject) => {
      Promise.resolve(this.dtOptions).then(resolvedDTOptions => {
        // validate object
        const isTableEmpty = Object.keys(resolvedDTOptions).length === 0 && $('tbody tr', this.el.nativeElement).length === 0;
        if (isTableEmpty) {
          reject('Both the table and dtOptions cannot be empty');
          return;
        }
        // Using setTimeout as a "hack" to be "part" of NgZone
        setTimeout(() => {
          // Assign DT properties here
          let options: ADTSettings = {
            rowCallback: (row, data, index) => {
              if (resolvedDTOptions.columns) {
                const columns = resolvedDTOptions.columns;
                this.applyNgPipeTransform(row, columns);
                this.applyNgRefTemplate(row, columns, data);
              }

              // run user specified row callback if provided.
              if (resolvedDTOptions.rowCallback) {
                resolvedDTOptions.rowCallback(row, data, index);
              }
            }
          };
          // merge user's config with ours
          options = Object.assign({}, resolvedDTOptions, options);
          this.dt = $(this.el.nativeElement).DataTable(options);
          resolve(this.dt);
        });
      });
    });
  }

  private applyNgPipeTransform(row: Node, columns: ADTColumns[]): void {
    // Filter columns with pipe declared
    const colsWithPipe = columns.filter(x => x.ngPipeInstance && !x.ngTemplateRef);
    colsWithPipe.forEach(el => {
      const pipe = el.ngPipeInstance;
      // find index of column using `data` attr
      const i = columns.findIndex(e => e.data === el.data);
      // get <td> element which holds data using index
      const rowFromCol = row.childNodes.item(i);
      // Transform data with Pipe
      const rowVal = $(rowFromCol).text();
      const rowValAfter = pipe.transform(rowVal);
      // Apply transformed string to <td>
      $(rowFromCol).text(rowValAfter);
    });
  }

  private applyNgRefTemplate(row: Node, columns: ADTColumns[], data: Object): void {
    // Filter columns using `ngTemplateRef`
    const colsWithTemplate = columns.filter(x => x.ngTemplateRef && !x.ngPipeInstance);
    colsWithTemplate.forEach(el => {
      const { ref, context } = el.ngTemplateRef;
      // get <td> element which holds data using index
      const i = columns.findIndex(e => e.data === el.data);
      const cellFromIndex = row.childNodes.item(i);
      // render onto DOM
      // finalize context to be sent to user
      const _context = Object.assign({}, context, context?.userData, {
        adtData: data
      });
      const instance = this.vcr.createEmbeddedView(ref, _context);
      this.renderer.appendChild(cellFromIndex, instance.rootNodes[0]);
    });
  }
}
