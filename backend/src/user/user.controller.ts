import {
	Controller,
	Get,
	Param,
	Post,
	Body,
	Put,
	Delete
} from '@nestjs/common';
import { UserService } from './user.service';
import { User as UserMode1 } from '@prisma/client';

@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get(':id')
	async getUserById(@Param('id') id: string): Promise<UserMode1> {
		return this.userService.user({ id: Number(id) });
	}

	@Get('/list/:id')
	async getAllUsers(@Param('id') id: string): Promise<UserMode1[]> {
		return this.userService.users({where: {NOT: {id: Number(id)}}, orderBy: {username: 'asc'}});
	}

	@Post()
	async signupUser (
		@Body() userData: { login: string; username: string; avatar: string }
	): Promise<UserMode1> {
		return this.userService.createUser(userData);
	}

	@Delete(':id')
	async deleteUser(@Param('id') id: string): Promise<UserMode1> {
		return this.userService.deleteUser({ id: Number(id) });
	}
}
