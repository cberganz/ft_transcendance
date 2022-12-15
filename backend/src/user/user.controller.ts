import {
	Controller,
	Get,
	Param,
	Post,
	Put,
	Body,
	UseFilters,
	Delete
} from '@nestjs/common';
import { UserService } from './user.service';
import { User as UserMode1, Prisma } from '@prisma/client';
import BackendException from '../utils/BackendException.filter'


class CreateUser {
	username:	string;
	login:		string;
}

@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

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

	@Get('/list/')
	async getAllUsers(): Promise<UserMode1[]> {
		return this.userService.users({orderBy: {username: 'asc'}});
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
	@UseFilters(BackendException)
	async updateUser(
		@Param('id') id: string,
		@Body() body: Prisma.UserUpdateInput): Promise<UserMode1> {
		return this.userService.updateUser({
			where: {
				id: Number(id)
			},
			data: body
		});
	}
}
