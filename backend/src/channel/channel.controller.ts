import {
	Controller,
	Get,
	Param,
	Post,
	Body,
	Put,
	Delete
} from '@nestjs/common';
import { ChannelService } from './channel.service';
import { Channel as ChannelMode1 } from '@prisma/client';

@Controller('channel')
export class ChannelController {
	constructor(private readonly channelService: ChannelService) {}

	@Get(':id')
	async getChannelById(@Param('id') id: string): Promise<ChannelMode1> {
		return this.channelService.channel({ id: Number(id) });
	}

	@Get('/joinedChannels/:userId')
	async getJoinedChannels(@Param('userId') userId: string): Promise<ChannelMode1[]> {
		return this.channelService.joinedChannels(Number(userId));
	}

	@Get('/notJoinedChannels/:userId')
	async getNotJoinedChannels(@Param('userId') userId: string): Promise<ChannelMode1[]> {
		return this.channelService.notJoinedChannels(Number(userId));
	}

	@Get()
	async getAllChannels(): Promise<ChannelMode1[]> {
		return this.channelService.allChannels();
	}

	@Post('/deleteMember/')
	async PostDeleteMember(
		@Body() data: { channelId: string; memberId: string; }
	) : Promise<ChannelMode1> {
		return this.channelService.deleteMember({channelId: Number(data.channelId), memberId: Number(data.memberId)})
	}

	@Post('/addMember/')
	async PostAddMember(
		@Body() data: { channelId: string; memberId: string; }
	) : Promise<ChannelMode1> {
		return this.channelService.addMember({channelId: Number(data.channelId), memberId: Number(data.memberId)})
	}

	@Post('/setPwd/')
	async PostSetPwd(
		@Body() data: { pwd: string; channelId: string; userId: string;}
	) : Promise<ChannelMode1> {
		return this.channelService.setPwd({pwd: data.pwd, channelId: Number(data.channelId), userId: Number(data.userId)})
	}

	@Post('/new/chan/')
	async newChannel (
		@Body() channelData: { type: string; password: string; title: string; ownerId: string }
	): Promise<ChannelMode1> {
		let newChan = await this.channelService.createChannel({
			type: channelData.type,
			password: channelData.password,
			title: channelData.title,
			owner: { connect: { id: Number(channelData.ownerId) } },
			members: { connect: { id: Number(channelData.ownerId) } },
			admin: { connect: { id: Number(channelData.ownerId) } },
		});
		return this.channelService.channel({ id: Number(newChan.id) });
	}

	@Post('/new/dm/')
	async newDMChannel (
		@Body() channelData: { user1: string, user2: string }
	): Promise<ChannelMode1> {
		let newChan = await this.channelService.createChannel({
			type: "dm",
			members: { connect: [{ id: Number(channelData.user1) }, { id: Number(channelData.user2) }] },
		});
		return this.channelService.channel({ id: Number(newChan.id) });
	}

	@Delete(':id')
	async deleteChannel(@Param('id') id: string): Promise<ChannelMode1> {
		return this.channelService.deleteChannel({ id: Number(id) });
	}
}
