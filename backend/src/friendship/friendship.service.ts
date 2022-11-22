import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Friendship, Prisma } from '@prisma/client';

@Injectable()
export class FriendshipService {
	constructor(private prisma: PrismaService) {}

	async friendship(
		friendshipWhereUniqueInput: Prisma.FriendshipWhereUniqueInput
	): Promise<Friendship | null> {
		return this.prisma.friendship.findUnique({
			where: friendshipWhereUniqueInput,
			include: {
				user1: true,
				user2: true,
			},
		});
	}

	async friendships(params: {
		skip?: number;
		take?: number;
		cursor?: Prisma.FriendshipWhereUniqueInput;
		where?: Prisma.FriendshipWhereInput;
		orderBy?: Prisma.FriendshipOrderByWithRelationInput;
	}): Promise<Friendship[]> {
		const { skip, take, cursor, where, orderBy } = params;
		return this.prisma.friendship.findMany({
			skip,
			take,
			cursor,
			where,
			orderBy,
		});
	}

	async createFriendship(data: Prisma.FriendshipCreateInput): Promise<Friendship> {
		return this.prisma.friendship.create({
			data,
		});
	}

	async updateFriendship(params: {
		where: Prisma.FriendshipWhereUniqueInput;
		data: Prisma.FriendshipUpdateInput;
	}): Promise<Friendship> {
		const { where, data } = params;
		return this.prisma.friendship.update({
			data,
			where,
		});
	}

	async deleteFriendship(where: Prisma.FriendshipWhereUniqueInput): Promise<Friendship> {
		return this.prisma.friendship.delete({
			where,
		});
	}
}
