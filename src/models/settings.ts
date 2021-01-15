import { PipeTransform } from '@angular/core';

export interface ADTSettings extends DataTables.Settings {
  columns?: ADTColumns[];
}
export interface ADTColumns extends DataTables.ColumnSettings {
  /** Set instance of Angular pipe to transform the data of particular column */
  ngPipeInstance?: PipeTransform;
}
