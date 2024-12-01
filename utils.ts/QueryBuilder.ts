import mysql, { Pool, PoolOptions, RowDataPacket } from "mysql2/promise";
import { Field } from "../types/Field";

export default class QueryBuilder<T> {
  private readonly _config: PoolOptions = {
    port: 3366,
    host: "db.hbo-ict.cloud",
    user: "pb2sea2425_yooheeyeerii58",
    database: "pb2sea2425_yooheeyeerii58_dev",
    password: "VHJobkZONqVhdVMg",
  };
  private _tables: string[] = [];
  private _where: string[] = [];
  private _values: Field[] = [];
  private _joins: string[] = [];
  private _sort: [string, string];
  private static _pool: Pool;

  public constructor(table: string) {
    this._tables.push(table);
    if (!QueryBuilder._pool) {
      QueryBuilder._pool = mysql.createPool(this._config);
    }
  }
  
  public join(target: string, manyToMany: boolean = false) {
    if (this._tables.indexOf(target) < 0) this._tables.push(target);
    if (manyToMany) {
      const linkTable: string = [this._tables[0], target].sort().join("");
      this._joins.push(`INNER JOIN ${linkTable} ON ${this._tables[0]}.id = ${linkTable}.${this._tables[0].toLowerCase()}_id INNER JOIN ${target} ON ${linkTable}.${target.toLowerCase()}_id = ${target}.id`);
    }
    else {
      this._joins.push(`INNER JOIN ${target} ON ${this._tables[0]}.${target.toLowerCase()}_id = ${target}.id`);
    }
    return this;
  }

  public where(field: string, operator: string, value: Field): this {
    this._where.push(`${this._where.length ? "AND" : "WHERE"} ${field} ${operator} ?`);
    this._values.push(value);
    return this;
  }

  public orWhere(field: string, operator: string, value: Field): this {
    this._where.push(`${this._where.length ? "OR" : "WHERE"} ${field} ${operator} ?`);
    this._values.push(value);
    return this;
  }

  public sort(field: keyof T & string, order: "ASC" | "DESC"): this {
    this._sort = [field, order];
    return this;
  }

  public async insert(...fields: [keyof T, Field][]): Promise<void> {
    const sql = `INSERT INTO ${this._tables[0]} (${fields.map(field => field[0])}) VALUES (${fields.map(() => "?")})`;
    await QueryBuilder._pool.query(sql, fields.map(field => field[1]));
  }

  public async get(amount?: number, offset: number = 0): Promise<RowDataPacket[]> {
    let sql = `SELECT ${this._tables.map(table => `${table}.*`)} FROM ${this._tables[0]} ${this._joins.length ? this._joins.join(" ") : ""} ${this._where.length ? this._where.join(" ") : ""} ${this._sort ? `ORDER BY ${this._sort[0]} ${this._sort[1]}` : ""} ${amount ? `LIMIT ${offset}, ${amount}` : ""}`;
    const [results] = await QueryBuilder._pool.query<RowDataPacket[]>({ sql, nestTables: true }, this._values);
    return results;
  }

  public async update(id: number, ...fields: [keyof T & string, Field][]): Promise<void> {
    const sql = `UPDATE ${this._tables[0]} SET ${fields.map(field => `${field[0]} = ?`)} WHERE ${this._tables}.id = ?`;
    await QueryBuilder._pool.query(sql, [...fields.map(field => field[1]), id]);
  }

  public async remove(field: keyof T & string, operator: string, value: Field) {
    const sql = `DELETE FROM ${this._tables[0]} WHERE ${field} ${operator} ?`;
    await QueryBuilder._pool.query(sql, value);
  }
}