import IQuestion from "../interfaces/IQuestion";
import Model from "./Model";
import User from "./User";
import QueryBuilder from "../utils.ts/QueryBuilder";
import { RowDataPacket } from "mysql2";
import { Field } from "../types/Field";

export default class Question extends Model implements IQuestion {
  public id: number;
  public uuid: string;
  public users_id: number;
  public title: string;
  public description: string;
  public status: boolean;
  public views: number;
  public slug: string;
  public created: Date;
  public updated: Date;
  public user: User;

  public constructor(data?: RowDataPacket) {
    super("questions");
    if (data) {
      this.id = data[this._table].id;
      this.uuid = data[this._table].uuid;
      this.users_id = data[this._table].users_id;
      this.title = data[this._table].title;
      this.description = data[this._table].description;
      this.views = data[this._table].views;
      this.slug = data[this._table].slug;
      this.created = data[this._table].created;
      this.updated = data[this._table].updated;
      this.user = new User(data);
    }
  }

  public async get(): Promise<Question> {
    return await new QueryBuilder<IQuestion>(this._table).join("users").get().then(rows => {
      return new Question(rows[0]);
    });
  }

  public async getAll(): Promise<Question[]> {
    return await new QueryBuilder<IQuestion>(this._table).join("users").sort("title", "ASC").get(1, 1).then(rows => {
      return rows.map(row => new Question(row));
    });
  }

  public async insert(...fields: [keyof IQuestion & string, Field][]): Promise<void> {
    if (fields.length) {
      await new QueryBuilder<IQuestion>(this._table).insert(...fields);
    }
    else {
      await new QueryBuilder<IQuestion>(this._table).insert(
        ["uuid", this.uuid],
        ["users_id", this.users_id],
        ["title", this.title],
        ["description", this.description],
        ["slug", this.slug]
      ); 
    }
  }
}