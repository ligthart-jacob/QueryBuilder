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

  public constructor(data: RowDataPacket) {
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
    else {
      throw new Error("Question does not exist");
    }
  }

  public static async getByUUID(uuid: string): Promise<Question> {
    return await new QueryBuilder<IQuestion>("questions").join("users").where("questions.uuid", "=", uuid).get().then(rows => {
      return new Question(rows[0]);
    });
  }

  public static async getAll(): Promise<Question[]> {
    return await new QueryBuilder<IQuestion>("questions").join("users").sort("title", "ASC").get().then(rows => {
      return rows.map(row => new Question(row));
    });
  }

  public static async getChunk(amount: number, offset: number = 0) {
    return await new QueryBuilder<IQuestion>("questions").join("users").sort("title", "ASC").get(amount, offset).then(rows => {
      return rows.map(row => new Question(row));
    });
  }

  public static async insert(users_id, title, description, slug): Promise<void> {
    await new QueryBuilder<IQuestion>("questions").insert(
      ["uuid", crypto.randomUUID()],
      ["users_id", users_id],
      ["title", title],
      ["description", description],
      ["slug", slug]
    );
  }

  public async update(): Promise<void> {
    await new QueryBuilder<IQuestion>("questions").update(
      this.id,
      ["title", this.title],
      ["description", this.description],
    )
  }

  public async remove(): Promise<void> {
    await new QueryBuilder<IQuestion>("questions").remove("id", "=", this.id);
  }
}