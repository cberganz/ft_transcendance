import {
	Controller,
	Get,
	Param,
	Post,
	Body,
	Put,
	Delete
} from '@nestjs/common';
import { FriendshipService } from './friendship.service';
import { Friendship as FriendshipMode1 } from '@prisma/client';

@Controller('friendship')
export class FriendshipController {
	constructor(private readonly friendshipService: FriendshipService) {}

	@Get(':id')
	async getFriendshipById(@Param('id') id: string): Promise<FriendshipMode1> {
		return this.friendshipService.friendship({ id: Number(id) });
	}

	//@Post()
	//async newFriendship (
	//	@Body() friendshipData: { user1_id: string; user2_id: string }
	//): Promise<FriendshipMode1> {
	//	return this.friendshipService.createFriendship(friendshipData);
	//}

	@Delete(':id')
	async deleteFriendship(@Param('id') id: string): Promise<FriendshipMode1> {
		return this.friendshipService.deleteFriendship({ id: Number(id) });
	}
}
