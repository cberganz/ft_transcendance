import {
	Controller,
	Post,
	UseInterceptors,
	UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { fileInterceptorOptions } from './file/fileInterceptorOptions';

@Controller()
export class AppController {
	@Post('upload')
	@UseInterceptors(FileInterceptor('file', fileInterceptorOptions))
	uploadFile(@UploadedFile() file: Express.Multer.File) {
		console.log(file.filename);
	}
}
