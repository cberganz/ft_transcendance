import {
	Controller,
	Get,
	Param,
	Post,
	Put,
	Body,
	UseFilters,
	Delete
} from '@nestjs/common';
import { UserService } from './user.service';
import { User as UserMode1, Prisma } from '@prisma/client';
import BackendException from '../utils/BackendException.filter'


class CreateUser {
	username:	string;
	login:		string;
}

class Game {
	id: number;
	date: string;
	playerScore: number;
	opponent: string;
	opponentScore: number;
	result: string;
}

class UserStats {
	id: number;
	avatar: string;
	username: string;
	games: Game[];
	playedGames: number;
	gamesWon: number;
	gamesLost: number;
	winRate: number;
}

@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get()
	@UseFilters(BackendException)
	async getUsers(): Promise<UserMode1[]> {
		return this.userService.users({});
	}

	@Get(':id')
	@UseFilters(BackendException)
	async getUserById(@Param('id') id: string): Promise<UserMode1> {
		return this.userService.user({ id: Number(id) });
	}

	@Get('/stats/:id')
	@UseFilters(BackendException)
	async getUserStats(@Param('id') id: string): Promise<UserStats> {
		let user = await this.userService.user({ id: Number(id) }) as any
		let games = [...user.p1_games, ...user.p2_games]
		let gamesPlayed = games.filter(function(obj) { return obj.player1_score }).map((game) => {
			let player = (game.player1Id === user.id ? 1 : 2)
			return {
				  		id: game.id,
				  		date: game.date,
				  		playerScore: player === 1 ? (game.player1_score) : (game.player2_score),
						opponent: player === 1 ? (game.player2.username) : (game.player1.username),
				  		opponentScore: player === 1 ? (game.player2_score) : (game.player1_score),
						result: player === 1
								? (game.player1_score > game.player2_score
									? ("Winner")
									: (game.player2_score > game.player1_score)
										? ("Loser")
										: ("Equality"))
								: (game.player2_score > game.player1_score
									? ("Winner")
									: (game.player1_score > game.player2_score)
										? ("Loser")
										: ("Equality"))
			};
		});
		let winrate = Math.round(gamesPlayed.filter(function(obj) { return obj.result === "Winner" }).length / gamesPlayed.length * 100)
		const data = {
			id: user.id,
			avatar: user.avatar,
			username: user.username,
			games: gamesPlayed,
			playedGames: gamesPlayed.length,
			gamesWon: gamesPlayed.filter(function(obj) { return obj.result === "Winner" }).length,
			gamesLost: gamesPlayed.filter(function(obj) { return obj.result === "Loser" }).length,
			winRate: winrate ? winrate : -1,
		}
		return data;
	}

	@Get('/list/:id')
	async getAllUsers(@Param('id') id: string): Promise<UserMode1[]> {
		return this.userService.users({where: {NOT: {id: Number(id)}}, orderBy: {username: 'asc'}});
	}
	
	@Post('signup')
	@UseFilters(BackendException)
	async signupUser (
		@Body() userData: CreateUser
	): Promise<UserMode1> {
		return this.userService.createUser(userData);
	}

	@Delete(':id')
	@UseFilters(BackendException)
	async deleteUser(@Param('id') id: string): Promise<UserMode1> {
		return this.userService.deleteUser({ id: Number(id) });
	}

	@Put(':id')
	@UseFilters(BackendException)
	async updateUser(
		@Param('id') id: string,
		@Body() body: Prisma.UserUpdateInput): Promise<UserMode1> {
		return this.userService.updateUser({
			where: {
				id: Number(id)
			},
			data: body
		});
	}
}
