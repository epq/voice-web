import Mysql from './mysql';

const CURRENT_VERSION = 1;

const CWD = process.cwd();
const CONFIG_FILE = CWD + '/config.json';
const config = require(CONFIG_FILE);

/**
 * Handles Overall DB Schema and Migrations.
 */
export default class Schema {
  mysql: Mysql;
  name: string;

  constructor(mysql: Mysql) {
    this.mysql = mysql;
    this.name = mysql.options.database;
  }

  /**
   * Make sure we have the database we are expecting.
   */
  private async ensureDatabase() {
    return this.mysql.rootQuery(
      `CREATE DATABASE IF NOT EXISTS ${this.name};
       USE ${this.name};`
    );
  }

  /**
   * Make sure we have the user privs set up.
   */
  private async ensureUser() {
    // Fetch the default username and password.
    const opts = this.mysql.options;
    const username = opts.user;
    const password = opts.password;
    const host = opts.host;
    const database = opts.database;
    try {
      await this.mysql.rootTransaction(
        `CREATE USER IF NOT EXISTS '${username}'@'${host}' IDENTIFIED BY '${password}';
         GRANT SELECT, INSERT ON ${database}.* TO '${username}'@'${host}';
         FLUSH PRIVILEGES;`
      );
    } catch (err) {
      console.error('DBDBDB', err);
    }
  }

  /**
   * Make sure the database exists.
   */
  async ensureExistance(): Promise<void> {
    await this.ensureDatabase();
    await this.ensureUser();
  }

  /**
   * Upgrade to CURRENT_VERSION of database.
   */
  async upgrade(): Promise<void> {
    return this.ensureExistance();
  }
}
