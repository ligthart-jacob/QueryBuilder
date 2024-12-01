import { RowDataPacket } from "mysql2";
import Model from "./Model";
import IUser from "../interfaces/IUser";

export default class User extends Model implements IUser {
  public id: number;
  public uuid: string;
  public name: string;
  public password: string;
  public email: string;
  public reputation: number;
  public image: string;
  public token: string;
  public salt: string;

  public constructor(data?: RowDataPacket) {
    super("users");
    if (data) {
      this.id = data[this._table].id;
      this.uuid = data[this._table].uuid;
      this.name = data[this._table].name;
      this.password = data[this._table].password;
      this.email = data[this._table].email;
      this.reputation = data[this._table].reputation;
      this.image = data[this._table].image;
      this.token = data[this._table].token;
      this.salt = data[this._table].salt;
    }
  }
}