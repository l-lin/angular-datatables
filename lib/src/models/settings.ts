import { PipeTransform, TemplateRef } from '@angular/core';
import { Config, ConfigColumns } from 'datatables.net';

export interface ADTSettings extends Config {
  columns?: ADTColumns[];
}
export interface ADTColumns extends ConfigColumns {
  /** Define the column's unique identifier */
  id?: string;
  /** Set instance of Angular pipe to transform the data of particular column */
  ngPipeInstance?: PipeTransform;
  /** Define the arguments for the tranform method of the pipe, to change its behavior */
  ngPipeArgs?: any[];
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
