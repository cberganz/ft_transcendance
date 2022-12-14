import {
	Controller,
	Post,
	UseInterceptors,
	UploadedFile,
	UseFilters
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { fileInterceptorOptions } from './file/fileInterceptorOptions';
import { DeleteFileOnErrorFilter } from './file/fileUpload.filter'
import { fileValidator } from './file/ConstantfileValidator'



@Controller()
export class AppController {
	@Post('upload')
	@UseInterceptors(FileInterceptor('file', fileInterceptorOptions))
	@UseFilters(DeleteFileOnErrorFilter)
	uploadFile(@UploadedFile(fileValidator) file: Express.Multer.File) {
	}
}
