export default class Model {
  protected _table: string;

  public constructor(table: string) {
    this._table = table;
  }
}