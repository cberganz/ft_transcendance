import {
	Controller,
	Get,
	Param,
	Post,
	Put,
	Body,
	UseFilters,
	Delete,
	UseInterceptors,
	UploadedFile,
	UnprocessableEntityException,
	UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User as UserMode1, Prisma } from '@prisma/client';
import BackendException from '../utils/BackendException.filter'
import { FileInterceptor } from '@nestjs/platform-express';
import { fileInterceptorOptions } from '../file/fileInterceptorOptions';
import { DeleteFileOnErrorFilter } from '../file/fileUpload.filter'
import { fileValidator } from '../file/ConstantfileValidator'
import OwnGuard from '../auth/own.guard'


class CreateUser {
	username:	string;
	login:		string;
}

@Controller('user')
export class UserController {
	constructor(
		private readonly userService: UserService,
	) {}

	@Get()
	@UseFilters(BackendException)
	async getUsers(): Promise<UserMode1[]> {
		return this.userService.users({});
	}

	@Get(':id')
	@UseFilters(BackendException)
	async getUserById(@Param('id') id: string): Promise<UserMode1> {
		return this.userService.user({ id: Number(id) });
	}

	@Get('/list/:id')
	async getAllUsers(@Param('id') id: string): Promise<UserMode1[]> {
		return this.userService.users({where: {NOT: {id: Number(id)}}, orderBy: {username: 'asc'}});
	}
	
	@Post('signup')
	@UseFilters(BackendException)
	async signupUser (
		@Body() userData: CreateUser
	): Promise<UserMode1> {
		return this.userService.createUser(userData);
	}

	@Delete(':id')
	@UseFilters(BackendException)
	async deleteUser(@Param('id') id: string): Promise<UserMode1> {
		return this.userService.deleteUser({ id: Number(id) });
	}

	@Put(':id')
	@UseGuards(OwnGuard)
	@UseInterceptors(FileInterceptor('file', fileInterceptorOptions))
	@UseFilters(DeleteFileOnErrorFilter)
	async updateUser(
		@UploadedFile(fileValidator) file: Express.Multer.File,
		@Param('id') id: string,
		@Body() body: Prisma.UserUpdateInput
		): Promise<UserMode1> {
			let updatedData = {
				...body,
				avatar: `http://localhost:3000/file/avatar/${file.filename}`
			}
			const userWithSameUsername =
				await this.userService.user({username: String(updatedData.username)});
			if (userWithSameUsername && userWithSameUsername.id !== Number(id))
				throw new UnprocessableEntityException();
			return this.userService.updateUser({
				where: {
					id: Number(id)
				},
				data: updatedData
			});
	}
}
