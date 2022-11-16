import {
	Controller,
	Get,
	Param,
	Post,
	Body,
	Put,
	Delete
} from '@nestjs/common';
import { BlacklistService } from './blacklist.service';
import { Blacklist as BlacklistMode1 } from '@prisma/client';

@Controller('blacklist')
export class BlacklistController {
	constructor(private readonly blacklistService: BlacklistService) {}

	@Get(':id')
	async getBlacklistById(@Param('id') id: string): Promise<BlacklistMode1> {
		return this.blacklistService.blacklist({ id: Number(id) });
	}

	//@Post()
	//async newBlacklist (
	//	@Body() blacklistData: { target_id: string; type: string; delay: string; channel?: string; creatorId: string }
	//): Promise<BlacklistMode1> {
	//	return this.blacklistService.createBlacklist(blacklistData);
	//}

	@Delete(':id')
	async deleteBlacklist(@Param('id') id: string): Promise<BlacklistMode1> {
		return this.blacklistService.deleteBlacklist({ id: Number(id) });
	}
}
