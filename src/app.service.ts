import { Injectable } from '@nestjs/common';
import mysql from "mysql2/promise"
import { Address } from './address.js';

const mySqlConnection = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "blocklist"
})

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  async getBlocklist() {
    const [results] = await mySqlConnection.execute(
      "SELECT * from blocklist"
    );

    return results as Address[];
  }

  async addAddress(priority: number, mac: string, enabled: boolean) {
    await mySqlConnection.execute(
      "INSERT INTO blocklist(priority, mac, enabled) VALUES (?,?,?)",
      [priority, mac, enabled]
    )
  }
}
