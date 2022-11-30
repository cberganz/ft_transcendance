import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Channel, Prisma } from '@prisma/client';

@Injectable()
export class ChannelService {
	constructor(private prisma: PrismaService) {}

	async channel(
		channelWhereUniqueInput: Prisma.ChannelWhereUniqueInput
	): Promise<Channel | null> {
		return this.prisma.channel.findUnique({
			where: channelWhereUniqueInput,
			include: {
				Message:  {
					include: {
						author: true,
					}
				},
				blacklist: true,
				admin: true,
				members: true,
				owner: true
			}
		});
	}

	async allChannels(): Promise<Channel[] | null> {
		return this.prisma.channel.findMany({
			include: {
				blacklist: true,
				admin: true,
				members: true,
				owner: true
			}
		});
	}

	async joinedChannels(userId: number): Promise<Channel[] | null> {
		return this.prisma.channel.findMany({
			where: {
				members: {
					some: {
						id: userId
					}
				}
			},
			include: {
				Message:  {
					include: {
						author: true,
					}
				},
				blacklist: true,
				admin: true,
				members: true,
				owner: true
			},
		});
	}

	async notJoinedChannels(userId: number): Promise<Channel[] | null> {
		return this.prisma.channel.findMany({
			where: {
				members: {
					none: {
						id: userId
					},
				},
				NOT: {
					type: "dm",
				},
			},
			include: {
				Message:  {
					include: {
						author: true,
					}
				},
				blacklist: true,
				admin: true,
				members: true,
				owner: true
			},
		});
	}

	async channels(params: {
		skip?: number;
		take?: number;
		cursor?: Prisma.ChannelWhereUniqueInput;
		where?: Prisma.ChannelWhereInput;
		orderBy?: Prisma.ChannelOrderByWithRelationInput;
	}): Promise<Channel[]> {
		const { skip, take, cursor, where, orderBy } = params;
		return this.prisma.channel.findMany({
			skip,
			take,
			cursor,
			where,
			orderBy,
		});
	}

	async createChannel(data: Prisma.ChannelCreateInput): Promise<Channel> {
		return this.prisma.channel.create({
			data,
		});
	}

	async updateChannel(params: {
		where: Prisma.ChannelWhereUniqueInput;
		data: Prisma.ChannelUpdateInput;
	}): Promise<Channel> {
		const { where, data } = params;
		return this.prisma.channel.update({
			data,
			where,
		});
	}

	async deleteMember(data: {channelId: number, memberId: number}): Promise<Channel> {
		return this.prisma.channel.update({
			where: {
				id: data.channelId,
			},
			data: {
				members: {
					disconnect: {
						id: data.memberId,
					}
				}
			},
			include: {
				Message:  {
					include: {
						author: true,
					}
				},
				blacklist: true,
				admin: true,
				members: true,
				owner: true
			},
		});
	}

	async addMember(data: {channelId: number, memberId: number}): Promise<Channel> {
		return this.prisma.channel.update({
			where: {
				id: data.channelId,
			},
			data: {
				members: {
					connect: {
						id: data.memberId,
					}
				}
			},
			include: {
				Message:  {
					include: {
						author: true,
					}
				},
				blacklist: true,
				admin: true,
				members: true,
				owner: true
			},
		});
	}

	async deleteChannel(where: Prisma.ChannelWhereUniqueInput): Promise<Channel> {
		return this.prisma.channel.delete({
			where,
		});
	}
}
