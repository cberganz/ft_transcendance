import {
	Controller,
	Get,
	Param,
	Post,
	Body,
	Put,
	Delete
} from '@nestjs/common';
import { GameService } from './game.service';
import { Game as GameMode1 } from '@prisma/client';

@Controller('game')
export class GameController {
	constructor(private readonly gameService: GameService) {}

	@Get(':id')
	async getGameById(@Param('id') id: string): Promise<GameMode1> {
		return this.gameService.game({ id: Number(id) });
	}

	//@Post()
	//async newGame (
	//	@Body() gameData: { player1Id: string; player2Id: string }
	//): Promise<GameMode1> {
	//	return this.gameService.createGame(gameData);
	//}

	@Delete(':id')
	async deleteGame(@Param('id') id: string): Promise<GameMode1> {
		return this.gameService.deleteGame({ id: Number(id) });
	}
}
