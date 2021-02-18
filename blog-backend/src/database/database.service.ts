/* eslint-disable prettier/prettier */
import { HttpException , Injectable, Logger } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const mysql  = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'test_password',
  database: 'blog_test',
  port: 3306,
});

@Injectable()
export class DBService {
    selectedPool = pool.promise();
    executePool = pool.promise();
    private readonly logger = new Logger(DBService.name);

    async query(sql: string, params: any[]): Promise<any> {
        try {
            if(sql.trim().substr(0, 6).toLocaleLowerCase() === 'select') {
                return (await this.selectedPool.query(sql, params))[0] as any[];
            } else {
                return (await this.executePool.query(sql, params))[0] as any[];
            }
        } catch(err) {
            this.logger.log(err);
            throw new HttpException("数据库查询出错", 500);
        }
    }
}
