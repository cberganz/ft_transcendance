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
import { User as UserMode1 } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileInterceptorOptions } from '../file/fileInterceptorOptions';
import { DeleteFileOnErrorFilter } from '../file/fileUpload.filter'
import { fileValidator } from '../file/ConstantfileValidator'
import OwnGuard from '../auth/own.guard'
import { updateUserDto } from './upateUserDto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

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
	@UseGuards(JwtAuthGuard)
	async getUsers(): Promise<UserMode1[]> {
		return this.userService.users({});
	}

	@Get(':id')
	@UseGuards(JwtAuthGuard)
	@UseGuards(JwtAuthGuard)
	async getUserById(@Param('id') id: string): Promise<UserMode1> {
		return this.userService.user({ id: Number(id) });
	}

	@Get('/list/:id')
	async getAllUsers(@Param('id') id: string): Promise<UserMode1[]> {
		return this.userService.users({where: {NOT: {id: Number(id)}}, orderBy: {username: 'asc'}});
	}

	@Post('signup')
	@UseGuards(JwtAuthGuard)
	async signupUser (
		@Body() userData: CreateUser
	): Promise<UserMode1> {
		let newUser = {
			...userData,
			avatar: "https://profile.intra.42.fr/assets/42_logo_black-684989d43d629b3c0ff6fd7e1157ee04db9bb7a73fba8ec4e01543d650a1c607.png",
			email: "robin@gmail.com"
		}
		return this.userService.createUser(newUser);
	}

	@Delete(':id')
	@UseGuards(JwtAuthGuard)
	async deleteUser(@Param('id') id: string): Promise<UserMode1> {
		return this.userService.deleteUser({ id: Number(id) });
	}

	@Put('/upload/avatar/:id')
	@UseGuards(OwnGuard)
	@UseInterceptors(FileInterceptor('file', fileInterceptorOptions))
	@UseFilters(DeleteFileOnErrorFilter)
	@UseGuards(JwtAuthGuard)
	async uploadAvatar(
		@UploadedFile(fileValidator) file: Express.Multer.File,
		@Param('id') id: string,
		): Promise<UserMode1> {
			const imageUrl = `http://localhost:3000/file/avatar/${file.filename}`
			let updatedData = {
				avatar: imageUrl,
			}
			return this.userService.updateUser({
				where: {
					id: Number(id)
				},
				data: updatedData
			});
	}

	@Put(':id')
	@UseGuards(OwnGuard)
	@UseGuards(JwtAuthGuard)
	async updateUserName(
		@Param('id') id: string,
		@Body() body: updateUserDto
		): Promise<UserMode1> {
			const user = await this.userService.user({id: Number(id)})
			const userWithSameUsername =
				await this.userService.user({username: String(body.username)});
			if (userWithSameUsername && userWithSameUsername.id !== Number(id))
				throw new UnprocessableEntityException();
			user.username = body.username
			return this.userService.updateUser({
				where: {
					id: Number(id)
				},
				data: {
					username: user.username,
				}
			});
	}

	@Get('/tfa/:id')
	@UseGuards(OwnGuard)
	@UseGuards(JwtAuthGuard)
	async getTfaQrCode(
		@Param('id') id: string,) {
		const otpauthUrl = (await this.userService.user({id: Number(id)})).otpauthUrl
		console.log(otpauthUrl)
		return this.userService.generateQrCodeDataURL(otpauthUrl)
	}

	@Put('/tfa/:id')
	@UseGuards(OwnGuard)
	@UseGuards(JwtAuthGuard)
	async updateTfa(
		@Param('id') id: string,
		@Body() body: any// peut etre mettre dto
		) {
			this.userService.updateUser({
				where: {
					id: Number(id)
				},
				data: {
					isTFAEnabled: body.enableTfa,
				}
			});
		return ({isTFAEnabled: body.enableTfa})
	}

}
