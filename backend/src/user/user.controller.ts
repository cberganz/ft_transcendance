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

	@Post()
	async signupUser (
		@Body() userData: { login: string; username: string }
	): Promise<UserMode1> {
		return this.userService.createUser(userData);
	}

	@Delete(':id')
	async deleteUser(@Param('id') id: string): Promise<UserMode1> {
		return this.userService.deleteUser({ id: Number(id) });
	}
}
