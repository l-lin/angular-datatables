import * as uuid from 'node-uuid';

export interface ISerializedModel {
  uid: string;
}

export abstract class BaseModel {
  private _uid: string;

  get uid() { return this._uid; }

  constructor() {
    this._uid = uuid.v4();
  }

  protected updateFromSerialized(json: ISerializedModel): this {
    this._uid = json.uid;
    return this;
  }
}
