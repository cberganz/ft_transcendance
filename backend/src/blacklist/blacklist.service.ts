import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Blacklist, Prisma } from '@prisma/client';

@Injectable()
export class BlacklistService {
	constructor(private prisma: PrismaService) {}

	async blacklist(
		blacklistWhereUniqueInput: Prisma.BlacklistWhereUniqueInput
	): Promise<Blacklist | null> {
		return this.prisma.blacklist.findUnique({
			where: blacklistWhereUniqueInput,
			include: {
				target: true,
				creator: true,
			},
		});
	}

	async blacklists(params: {
		skip?: number;
		take?: number;
		cursor?: Prisma.BlacklistWhereUniqueInput;
		where?: Prisma.BlacklistWhereInput;
		orderBy?: Prisma.BlacklistOrderByWithRelationInput;
	}): Promise<Blacklist[]> {
		const { skip, take, cursor, where, orderBy } = params;
		return this.prisma.blacklist.findMany({
			skip,
			take,
			cursor,
			where,
			orderBy,
		});
	}

	async createBlacklist(data: Prisma.BlacklistCreateInput): Promise<Blacklist> {
		let user = await this.prisma.user.findUnique({
			where: {
				id: data.creator.connect.id,
			},
			include: {
				admin_of: true,
			}
		});
		let isAdmin = false;
		for (let i = 0; i < user.admin_of.length; i++) {
			if (user.admin_of[i].id == data.channel.connect.id) {
				isAdmin = true;
				break ;
			}
		}
		if (isAdmin || data.type === "block")
			return this.prisma.blacklist.create({
				data,
			});
		return (null); // ERROOOOOOOOOOOOOOR
	}

	async updateBlacklist(params: {
		where: Prisma.BlacklistWhereUniqueInput;
		data: Prisma.BlacklistUpdateInput;
	}): Promise<Blacklist> {
		const { where, data } = params;
		return this.prisma.blacklist.update({
			data,
			where,
		});
	}

	async deleteBlacklist(where: Prisma.BlacklistWhereUniqueInput): Promise<Blacklist> {
		return this.prisma.blacklist.delete({
			where,
		});
	}
}
