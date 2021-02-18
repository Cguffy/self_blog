/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-var-requires */
import { HttpException,  Injectable, Logger } from '@nestjs/common';
import { DBService } from '../database/database.service';

@Injectable()
export class BlogService {
  constructor(private readonly dbService: DBService) {}
  private readonly logger = new Logger(DBService.name);
  private blog_id = 1;
  private categories = ['nestjs','vue','go','c++','java','python'];

  async postBlog(username: string, blog_info: any): Promise<{result: string}> {
    const {blogId, author, title, text} = blog_info;
    if(blogId != 0 || author != username){
      // console.log("blog_id: ", blogId);
      // console.log("author: ", author);
      throw new HttpException('服务器拒绝服务', 403);
    }
    const category = blog_info.category||'';
    if(category != '' && this.categories.indexOf(category)<0){
      throw new HttpException('分类不合法', 403);
    }
    const tags = blog_info.tags||'';
    const sql = `insert into blogs(blogId,author,title,text,category,tags) values(?,?,?,?,?,?)`;
    await this.dbService.query(sql, [this.blog_id, author, title, text, category, tags]);
    this.blog_id += 1;
    this.logger.log(`user: ${username} post blog successfully`);
    return {result: `user: ${username} post blog successfully`};
  }

  async newViewed(id: number): Promise<{result: boolean}> {
    const sql = `select * from blogs where blogId = ?`;
    const res = await this.dbService.query(sql, [id]);
    if(res.length <= 0){
      return {result: false};
    }
    const viewSql = `update blogs set viewed = viewed+1 where blogId = ?`;
    await this.dbService.query(viewSql, [id]);
    this.logger.log(`blog: ${id} is viewed once`);
    return {result: true};
  }

  async updateBlog(loginUser: string, body: any): Promise<{result: boolean}> {
    const sql = `select * from blogs where blogId = ?`;
    const res = (await this.dbService.query(sql, [body.blogId]))[0];
    // console.log(res);
    console.log(body);
    if(loginUser!=res.author){
      console.log("登录名与文章名不同");
      throw new HttpException('服务器拒绝服务', 403);
    }
    let updateSql = `update blogs set `;
    let i: any;
    for(i in body){
        if(body[i] != null){
          updateSql += `${i} = '${body[i]}',`;
        }
    }
    updateSql = updateSql.substr(0, updateSql.length-1);
    updateSql += ` where blogId = ?;`
    console.log(updateSql);
    await this.dbService.query(updateSql, [body.blogId]).catch((err)=>{
      throw new HttpException('服务器拒绝更新', 403);
    });
    this.logger.log(`user: ${loginUser} update blog: ${body.blogId} successfully`);
    return {result: true};
  }

  async getBlogById(id: number): Promise<any> {
    if(id<0){
      throw new HttpException('id 不合法', 403);
    }
    const sql = `select * from blogs where blogId = ?`;
    const res = await this.dbService.query(sql, [id]);
    if(res.length <= 0){
      throw new HttpException('文章不存在', 403);
    }
    this.logger.log(`successfully get the blog: ${id}`);
    return res;
  }

  async getSelfBlogs(username: string): Promise<any> {
    const sql = `select * from blogs where author = ?`;
    const res = await this.dbService.query(sql, [username]);
    this.logger.log(`user: ${username} successfully get all his/her own blogs`);
    return res;
  }

  async getBlogsByAuthor(author: string): Promise<any> {
    // console.log("author: ", author);
    const sql = 'select * from user where username = ?';
    const isRegisted = await this.dbService.query(sql, [author]);
    if(isRegisted.length <= 0){
      throw new HttpException('用户不存在', 403);
    }
    const getBlogsSql = `select * from blogs where author = ?`;
    const res = await this.dbService.query(getBlogsSql, [author]);
    this.logger.log(`successfully get the blog of author: ${author}`);
    return res;
  }

  async getBlogsByStartAndNum(start: number, num: number): Promise<any> {
    const sql = `select * from blogs limit ?,?`;
    // console.log(`start: ${start}, num: ${num}`);
    const res = await this.dbService.query(sql, [start, num]);
    this.logger.log(`successfully get ${num} blogs with id start from: ${start}`);
    return res;
  }

  async searchBlogs(searchStr: string): Promise<any[]> {
    const sql = `select * from blogs where title like '%${searchStr}%' or text like '%${searchStr}%'`;
    const res = await this.dbService.query(sql, []);
    this.logger.log(`successfully get ${res.length} blogs with string ${searchStr}`);
    return res;
  }

  async getLatestBlogsWithNum(num: number): Promise<any> {
    const sql = `select * from blogs order by blogId desc limit ?`;
    const res =  await this.dbService.query(sql, [num]);
    this.logger.log(`successfully get ${num} latest blogs`);
    return res;
  }

  async getHottestBlogsWithNum(num: number): Promise<any> {
    const sql = `select * from blogs order by viewed desc,blogId desc limit ?`;
    const res =   await this.dbService.query(sql, [num]);
    this.logger.log(`successfully get ${num} hottest blogs`);
    return res;
  }
}
