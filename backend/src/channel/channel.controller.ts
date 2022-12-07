import {
	Controller,
	Get,
	Param,
	Post,
	Body,
	Put,
	UseFilters,
	Delete,
	ForbiddenException
} from '@nestjs/common';
import { ChannelService } from './channel.service';
import { Channel as ChannelMode1 } from '@prisma/client';
import BackendException from '../utils/BackendException.filter'

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

	@Delete('/Member/')
	async DeleteMember(
		@Body() data: { channelId: string; memberId: string; }
	) : Promise<ChannelMode1> {
		return this.channelService.deleteMember({channelId: Number(data.channelId), memberId: Number(data.memberId)})
	}

	@Post('/Member/')
	async PostAddMember(
		@Body() data: { channelId: string; memberId: string; pwd: string; }
	) : Promise<ChannelMode1> {
		let chan = await this.getChannelById(data.channelId);

		if (chan.type === "private") {
			const bcrypt = require ('bcrypt');
			if (!bcrypt.compareSync(data.pwd, chan.password))
				throw ForbiddenException ;
		}
		return this.channelService.addMember({channelId: Number(data.channelId), memberId: Number(data.memberId)})
	}

	@Post('/setPwd/')
	async PostSetPwd(
		@Body() data: { pwd: string; channelId: string; userId: string;}
	) : Promise<ChannelMode1> {
		const bcrypt = require ('bcrypt');

		const salt = bcrypt.genSaltSync(10);
		let hash = bcrypt.hashSync(data.pwd, salt);
		if (data.pwd === "")
			hash = "";
		return this.channelService.setPwd({pwd: hash, channelId: Number(data.channelId), userId: Number(data.userId)})
	}

	@Post('/addAdmin/')
	@UseFilters(BackendException)
	async PostAddAdmin(
		@Body() data: { adminId: string; chanId: string; userId: string;}
	) : Promise<ChannelMode1> {
		return this.channelService.addAdmin({adminId: Number(data.adminId), chanId: Number(data.chanId), userId: Number(data.userId)})
	}

	@Post('/newChan/')
	async newChannel (
		@Body() channelData: { type: string; password: string; title: string; ownerId: string }
	): Promise<ChannelMode1> {
		const bcrypt = require ('bcrypt');

		const salt = bcrypt.genSaltSync(10);
		let hash = bcrypt.hashSync(channelData.password, salt);
		if (channelData.password === "")
			hash = "";
		let newChan = await this.channelService.createChannel({
			type: channelData.type,
			password: hash,
			title: channelData.title,
			owner: { connect: { id: Number(channelData.ownerId) } },
			members: { connect: { id: Number(channelData.ownerId) } },
			admin: { connect: { id: Number(channelData.ownerId) } },
		});
		return this.channelService.channel({ id: Number(newChan.id) });
	}

	@Post('/newDM/')
	async newDMChannel (
		@Body() channelData: { user1: string, user2: string }
	): Promise<ChannelMode1> {
		let newChan = await this.channelService.createChannel({
			type: "dm",
			members: { connect: [{ id: Number(channelData.user1) }, { id: Number(channelData.user2) }] },
		});
		console.log(newChan)
		return this.channelService.channel({ id: Number(newChan.id) });
	}

	@Delete(':id')
	async deleteChannel(@Param('id') id: string): Promise<ChannelMode1> {
		return this.channelService.deleteChannel({ id: Number(id) });
	}
}
