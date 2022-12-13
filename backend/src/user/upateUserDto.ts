import { IsNotEmpty } from 'class-validator';

export class updateUserDto  {
	file?: Express.Multer.File;

	@IsNotEmpty()
	username: string;
}