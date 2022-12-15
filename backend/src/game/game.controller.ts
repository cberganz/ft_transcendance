import {
	Controller,
	Get,
	Param,
	Post,
	Body,
	Put,
	Delete,
	UseFilters
} from '@nestjs/common';
import { GameService } from './game.service';
import { Game as GameMode1 } from '@prisma/client';
import BackendException from '../utils/BackendException.filter'

@Controller('game')
export class GameController {
	constructor(private readonly gameService: GameService) {}

	@Get(':id')
	@UseFilters(BackendException)
	async getGameById(@Param('id') id: string): Promise<GameMode1> {
		return this.gameService.game({ id: Number(id) });
	}

	@Post()
	@UseFilters(BackendException)
	async newGame (
		@Body() gameData: { player1Id: string; player2Id: string }
	): Promise<GameMode1> {
		return this.gameService.createGame({
			player1: { connect: { id: Number(gameData.player1Id) } },
			player2: { connect: { id: Number(gameData.player2Id) } },
		});
	}

	@Delete(':id')
	@UseFilters(BackendException)
	async deleteGame(@Param('id') id: string): Promise<GameMode1> {
		return this.gameService.deleteGame({ id: Number(id) });
	}
}
