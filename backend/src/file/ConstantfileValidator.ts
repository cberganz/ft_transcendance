import {
	ParseFilePipeBuilder,
	HttpStatus,
} from '@nestjs/common';

export const fileValidator =
	new ParseFilePipeBuilder()
		.addFileTypeValidator({
			fileType: 'jpeg',
		})
		.addMaxSizeValidator({
			maxSize: 100000
		})
		.build({
			errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY
		})