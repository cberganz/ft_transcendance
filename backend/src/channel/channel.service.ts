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
		let chan = await this.prisma.channel.findMany({
			where: {
				title: data.title,
			}
		});
		if (chan.length === 0 || data.type === 'dm')
			return this.prisma.channel.create({
				data,
			});
		////////////// handle error
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

	async setPwd(data: {pwd: string, channelId: number, userId: number}): Promise<Channel> {
		const chan = await this.prisma.channel.findUnique( {
			where: {
				id: data.channelId,
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
			}
		})
		let type;
		if (data.pwd === "")
			type = "public";
		else
			type = "private";
		if (chan.ownerId && chan.ownerId === data.userId) {
			return this.prisma.channel.update({
				where: {
					id : data.channelId,
				},
				data: {
					password: data.pwd,
					type: type,
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
				}
			}) ;
		}
		else
			return chan;
	}

	async addAdmin(data: {adminId: number, chanId: number, userId: number}): Promise<Channel> {
		const chan = await this.prisma.channel.findUnique( {
			where: {
				id: data.chanId,
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
		}) ;
		let userIsAdmin = false ;
		for (let admin of chan.admin) {
			if (admin.id === data.adminId)
				return chan ;
			if (admin.id === data.userId) {
				userIsAdmin = true ;
				break ;
			}
		}
		if (userIsAdmin) {
			return this.prisma.channel.update({
				where: {
					id : data.chanId,
				},
				data: {
					admin: {
						connect: {
							id : data.adminId,
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
				}
			}) ;
		}
		else
			return chan ;


	}
	async deleteMember(data: {channelId: number, memberId: number}): Promise<Channel> {
		const chan = await this.prisma.channel.findUnique( {
			where: {
				id: data.channelId,
			}
		})
		
		return this.prisma.channel.update({
			where: {
				id: data.channelId,
			},
			data: {
				members: {
					disconnect: {
						id: data.memberId,
					}
				},
				admin: {
					disconnect: {
						id: data.memberId,
					}
				},
				ownerId: chan.ownerId === data.memberId ? null : chan.ownerId,
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
		const chan = await this.prisma.channel.findUnique( {
			where: {
				id: data.channelId,
			},
			include: {
				admin: true,
			}
		})
		if (chan.admin.length === 0)
			return this.prisma.channel.update({
				where: {
					id: data.channelId,
				},
				data: {
					members: {
						connect: {
							id: data.memberId,
						}
					},
					admin: {
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
		else
			return this.prisma.channel.update({
				where: {
					id: data.channelId,
				},
				data: {
					members: {
						connect: {
							id: data.memberId,
						}
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

	async deleteChannel(where: Prisma.ChannelWhereUniqueInput): Promise<Channel> {
		return this.prisma.channel.delete({
			where,
		});
	}
}
