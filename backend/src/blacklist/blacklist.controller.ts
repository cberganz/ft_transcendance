import {
	Controller,
	Get,
	Param,
	Post,
	Body,
	Put,
	Delete,
	UseFilters,
	UseGuards,
} from '@nestjs/common';
import { BlacklistService } from './blacklist.service';
import { Blacklist as BlacklistMode1 } from '@prisma/client';
import BackendException from '../utils/BackendException.filter'
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('blacklist')
export class BlacklistController {
	constructor(private readonly blacklistService: BlacklistService) {}

	@UseGuards(JwtAuthGuard)
	@UseFilters(BackendException)
	@Get(':id')
	async getBlacklistById(@Param('id') id: string): Promise<BlacklistMode1> {
		return this.blacklistService.blacklist({ id: Number(id) });
	}

	@UseGuards(JwtAuthGuard)
	@UseFilters(BackendException)
	@Post()
	async newBlacklist (
		@Body() blacklistData: { target_id: string; type: string; delay?: string; channelId?: string; creatorId: string }
	): Promise<BlacklistMode1> {
		if (!blacklistData.channelId)
			return this.blacklistService.createBlacklist({
				type: blacklistData.type,
				delay: Number(blacklistData.delay),
				target: { connect: { id: Number(blacklistData.target_id) } },
				creator: { connect: { id: Number(blacklistData.creatorId) } },
			});
		if (blacklistData.delay)
			return this.blacklistService.createBlacklist({
				type: blacklistData.type,
				delay: Number(blacklistData.delay),
				channel: { connect: { id: Number(blacklistData.channelId) } },
				target: { connect: { id: Number(blacklistData.target_id) } },
				creator: { connect: { id: Number(blacklistData.creatorId) } },
			});
		return this.blacklistService.createBlacklist({
			type: blacklistData.type,
			channel: { connect: { id: Number(blacklistData.channelId) } },
			target: { connect: { id: Number(blacklistData.target_id) } },
			creator: { connect: { id: Number(blacklistData.creatorId) } },
		});
	}

	@UseGuards(JwtAuthGuard)
	@UseFilters(BackendException)
	@Delete(':id')
	async deleteBlacklist(@Param('id') id: string): Promise<BlacklistMode1> {
		return this.blacklistService.deleteBlacklist({ id: Number(id) });
	}
}
