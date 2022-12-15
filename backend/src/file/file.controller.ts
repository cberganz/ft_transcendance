import {
	Controller,
	Get,
	Res,
	Param
} from '@nestjs/common';

@Controller('file')
export class FileController {

	@Get('/avatar/:filename')
	async getFile(@Param('filename') filename: string, @Res() res): Promise<any> {
		res.sendFile(filename, { root: '/app/src/uploaded_files/'});
	}
}
