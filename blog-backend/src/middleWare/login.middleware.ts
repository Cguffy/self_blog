/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/ban-types */
import { HttpException, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { DBService } from '../database/database.service';

@Injectable()
export class LoginMiddleware implements NestMiddleware {
  constructor(private readonly dbService: DBService) {}

  use(req, response: Response, next: Function) {
    // console.log('Request...');
    const token = req.cookies.token;
    // console.log(token);
    if(token==undefined){
        const err = new HttpException('用户尚未登录', 403);
        next(err);
        return;
    }
    const sql = `select * from token where token = ?`;
    this.dbService.query(sql, [token]).then((res)=>{
        // console.log(res);
        if(res.length==0){
            const err = new HttpException('token 无效', 403);
            next(err);
        }
        else{
            req.username = res[0].username;
            next();
        }
    });
  }
}
