/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Req, HttpException, Query } from '@nestjs/common';
import { query } from 'express';
import { BlogService } from './blog.service';

@Controller('app/blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post()
  async postBlog(@Body() blog_info, @Req() req): Promise<any> {
    const username = req.username;
    // console.log(req);
    // console.log(blog_info);
    // return await this.userService.register(new_user);
    return await this.blogService.postBlog(username, blog_info);
  }

  @Post('viewed')
  async newViewed(@Body() body): Promise<{result: boolean}> {
    const id = body.blogId;
    return await this.blogService.newViewed(id);
  }

  @Post('update')
  async updateBlog(@Req() req, @Body() body): Promise<{result: boolean}> {
    const loginUser = req.username;
    return await this.blogService.updateBlog(loginUser, body);
  }

  @Get()
  async getBlogs(@Query() query): Promise<any> {
    const id = query.id;
    const author = query.author;
    const start = query.start;
    const num = query.num;
    const searchStr = query.searchStr;
    // console.log(id);
    if(id){
      // console.log("id");
      const res = await this.blogService.getBlogById(id);
      // console.log(res);
      return res;
    }
    else if(author){
      // console.log("author");
      return await this.blogService.getBlogsByAuthor(author);
    }
    else if(start && num){
      // console.log("start");
      const _start = parseInt(start);
      const _num = parseInt(num);
      if(isNaN(_start) || isNaN(_num)){
        throw new HttpException('参数应为数字', 403);
      }
      return await this.blogService.getBlogsByStartAndNum(_start, _num);
    }
    else if(searchStr){
      return await this.blogService.searchBlogs(query.searchStr);
    }
    else{
      throw new HttpException('服务器拒绝服务', 403);
    }
  }

  @Get('self')
  async getSelfBlogs(@Req() req): Promise<any> {
    const username = req.username;
    return await this.blogService.getSelfBlogs(username);
  }

  // @Get()
  // async getBlogsByAuthor(@Query() query: {author: string}): Promise<any> {
  //   return await this.blogService.getBlogsByAuthor(query.author);
  // }

  // @Get()
  // async getBlogsByStartAndNum(@Query() query: {start: number, num: number}): Promise<any> {
  //   return await this.blogService.getBlogsByStartAndNum(query.start, query.num);
  // }

  @Get('latest')
  async getLatestBlogsWithNum(@Query() query: {num: string}): Promise<any> {
    const _num = parseInt(query.num)
    if(isNaN(_num)){
      throw new HttpException('参数应为数字', 403);
    }
    return await this.blogService.getLatestBlogsWithNum(_num);
  }

  @Get('hottest')
  async getHotestBlogsWithNum(@Query() query: {num: string}): Promise<any> {
    const _num = parseInt(query.num);
    if(isNaN(_num)){
      throw new HttpException('参数应为数字', 403);
    }
    return await this.blogService.getHottestBlogsWithNum(_num);
  }
}
