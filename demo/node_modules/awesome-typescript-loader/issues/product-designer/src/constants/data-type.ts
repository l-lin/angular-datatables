import { minDate } from './env';

export enum DataType {
  Integer = 0,
  Decimal = 1,
  Date = 2,
  Text = 3,
  Boolean = 4,
}

export const dataTypeValues = [
  DataType.Integer,
  DataType.Decimal,
  DataType.Date,
  DataType.Text,
  DataType.Boolean,
];

export const dataTypeLabels = {
  [DataType.Integer]: 'Integer',
  [DataType.Decimal]: 'Decimal',
  [DataType.Date]: 'Date',
  [DataType.Text]: 'Text',
  [DataType.Boolean]: 'Yes/No',
};

export const dataTypeDefaults = {
  [DataType.Integer]: 0,
  [DataType.Decimal]: 0,
  [DataType.Date]: minDate,
  [DataType.Text]: '',
  [DataType.Boolean]: false,
};
