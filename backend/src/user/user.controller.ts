import {
	Controller,
	Get,
	Param,
	Post,
	Body,
	UseFilters,
	Delete
} from '@nestjs/common';
import { UserService } from './user.service';
import { User as UserMode1 } from '@prisma/client';
import BackendException from '../utils/BackendException.filter'

class CreateUser {
	username:	string;
	login:		string;
}

@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get(':id')
	@UseFilters(BackendException)
	async getUserById(@Param('id') id: string): Promise<UserMode1> {
		return this.userService.user({ id: Number(id) });
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
}
