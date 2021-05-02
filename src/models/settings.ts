import { PipeTransform, TemplateRef } from '@angular/core';

export interface ADTSettings extends DataTables.Settings {
  columns?: ADTColumns[];
}
export interface ADTColumns extends DataTables.ColumnSettings {
  /** Set instance of Angular pipe to transform the data of particular column */
  ngPipeInstance?: PipeTransform;
  /** Set `TemplateRef` to transform the data of this column */
  ngTemplateRef?: ADTTemplateRef;
}

export interface ADTTemplateRef {
  /** `TemplateRef` to work with */
  ref: TemplateRef<any>;
  /** */
  context?: ADTTemplateRefContext;
}

export interface ADTTemplateRefContext {
  captureEvents: Function;
  userData?: any;
}
