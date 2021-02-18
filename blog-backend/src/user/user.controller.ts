/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Req, Res, HttpException } from '@nestjs/common';
import { response } from 'express';
import { UserService } from './user.service';

@Controller('app/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(@Body() new_user): Promise<any> {
      return await this.userService.register(new_user);
  }

  @Post('login')
  async login(@Req() req, @Res() res): Promise<any> {
    const loginResult = await this.userService.login(req.body.username, req.body.password);
    res.setHeader('Set-Cookie', `token=${loginResult.token}; path=/`);
    res.json({result: 'login successfully'});
  }

  @Post('logout')
  async logout(@Req() req, @Res() response): Promise<any> {
    const username = req.username;
    const res = await this.userService.logout(username);
    response.cookie('token', '', {maxAge: 0});
    response.json(res);
  }

  @Post('update')
  async update(@Req() req: any): Promise<{result: string}> {
    // console.log("req:\n" + req);
    const username = req.username;
    await this.userService.update(username, req.body);
    return {result: "update successfully"};
  }

  @Get('selfInfo')
  async getSelfInfo(@Req() req): Promise<{userInfo: any}> {
    const username = req.username;
    const userInfo = await this.userService.getSelfInfo(username);
    return { userInfo: userInfo};
  }

  @Get('isRegisted')
  async isRegisted(@Body() body): Promise<{result: boolean}> {
    const username = body.username;
    const res = await this.userService.isRegisted(username);
    return {result: res};
  }

  @Get('isLogin')
  async isLogin(@Req() req): Promise<{result: boolean, username: string}> {
    return {result: true, username: req.username};
  }

  @Get('blogsCount')
  async blogsCount(@Req() req): Promise<{result: number}> {
    const res = await this.userService.blogsCount(req.username);
    return {result: res.count};
  }
}
