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

	@Get()
	async getAllChannels(): Promise<ChannelMode1[]> {
		return this.channelService.allChannels();
	}

	@Post()
	async newChannel (
		@Body() channelData: { type: string; password?: string; title: string; ownerId: string }
	): Promise<ChannelMode1> {
		return this.channelService.createChannel({
			type: channelData.type,
			password: channelData.password,
			title: channelData.title,
			owner: { connect: { id: Number(channelData.ownerId) } },
			members: { connect: { id: Number(channelData.ownerId) } },
			admin: { connect: { id: Number(channelData.ownerId) } },
		});
	}

	@Delete(':id')
	async deleteChannel(@Param('id') id: string): Promise<ChannelMode1> {
		return this.channelService.deleteChannel({ id: Number(id) });
	}
}
