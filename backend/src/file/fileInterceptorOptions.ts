import { diskStorage } from 'multer';
import { existsSync, mkdirSync } from 'fs';
const path = require('path')

export const fileInterceptorOptions = {
	storage: diskStorage({
		destination: (req: any, file: any, cb: any) => {
			const uploadPath = '/app/src/uploaded_files'; // set path in env var
			if (!existsSync(uploadPath))
				mkdirSync(uploadPath);
			cb(null, uploadPath);
		},	
		filename: function (req, file, cb) {
			const extension: string = path.extname(file.originalname);
			cb(null, `${file.fieldname}${extension}`) // get user login
		},
	})
}