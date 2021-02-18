/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-empty-function */
import { Controller, Get, Post, Body, Req, HttpException, Query, UseInterceptors, Param, UploadedFiles, Res } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { FileService } from './file.service';

@Controller('app/file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('file'))
  async postFile(@Req() req, @UploadedFiles() files): Promise<{result: number[]}> {
    const username = req.username;
    const res = this.fileService.saveFiles(username, files);
    return res;
  }

  @Get(':id')
  async getFileById(@Res() response: Response, @Param() params: {id: string}) {
      const id = params.id;
      const _id = parseInt(id);
      if(isNaN(_id)){
        throw new HttpException('参数不合法', 406);
      }
      const res = await this.fileService.getFileById(_id, response);
      response.status(200).end(res);
  }
}
