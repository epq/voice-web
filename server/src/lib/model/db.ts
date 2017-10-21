import Mysql from './db/mysql';
import Schema from './db/schema';
import UserDB from './db/user-db';

export default class DB {
  mysql: Mysql;
  schema: Schema;
  user: UserDB;

  constructor() {
    this.mysql = new Mysql();
    this.schema = new Schema(this.mysql);
    this.user = new UserDB(this.mysql);
  }

  /**
   * Make sure we have a fully updated schema.
   */
  async ensureLatest() {
    return this.schema.upgrade();
  }
}
