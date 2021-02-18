/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-var-requires */
import { HttpException,  Injectable, Logger } from '@nestjs/common';
import { DBService } from '../database/database.service';
import { Response } from 'express';
import * as fs from 'fs';
// const fs = require('fs')

@Injectable()
export class FileService {
  constructor(private readonly dbService: DBService) {}
  private readonly logger = new Logger(DBService.name);
  
  async saveFiles(username: string, files: any): Promise<{result: number[]}> {
    const res = [];
    for(const file of files){
      if(file.fieldname != 'file'){
        continue;
      }
      const sql = `insert into files(username, mimetype) values(?,?)`;
      const file_id = (await this.dbService.query(sql, [username, file.mimetype])).insertId;
      // console.log("res:\n", sqlRes);
      // const file_id = res.insertId;
      // console.log("fileId: ", file_id);
      fs.writeFileSync(`./static/${file_id}`, file.buffer);
      res.push(file_id);
    }
    return {result: res};
  }

  async getFileById(id: number, response: Response): Promise<any> {
    const sql = `select mimetype from files where fId = ?`;
    const sqlRes = await this.dbService.query(sql, [id]);
    if(sqlRes.length <= 0){
      throw new HttpException('不存在此文件', 404);
    }
    const mimetype = sqlRes[0].mimetype;
    // console.log("mimetype: ", mimetype);
    try{
      const filePath = `./static/${id}`;
      const res = fs.readFileSync(filePath);
      response.setHeader('Content-Type', mimetype);
      return res;
    }
    catch{
      throw new HttpException('不存在此文件', 404);
    }
  }
}
