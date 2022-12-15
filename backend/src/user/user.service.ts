import { Injectable  } from '@nestjs/common';
import {PrismaService} from "../prisma/prisma.service"
import { User, Prisma } from '@prisma/client';
import { toDataURL } from 'qrcode';
import {authenticator} from 'otplib'


@Injectable()
export class UserService {
	constructor(
		private prisma: PrismaService,
	) {}

	async user(
		userWhereUniqueInput: Prisma.UserWhereUniqueInput
	): Promise<User | null> {
		return this.prisma.user.findUnique({
			where: userWhereUniqueInput,
			include: {
				blacklist: {
					include: {
						target: true,
						creator: true,
					},
				},
				blacklisted: {
					include: {
						target: true,
						creator: true,
					},
				},
			}
		});
	}

	async users(params: {
		skip?: number;
		take?: number;
		cursor?: Prisma.UserWhereUniqueInput;
		where?: Prisma.UserWhereInput;
		orderBy?: Prisma.UserOrderByWithRelationInput;
	}): Promise<User[]> {
		const { skip, take, cursor, where, orderBy } = params;
		return this.prisma.user.findMany({
			skip,
			take,
			cursor,
			where,
			orderBy,
		});
	}

	async createUser(data: Prisma.UserCreateInput): Promise<User> {
		return this.prisma.user.create({
			data,
		});
	}

	async updateUser(params: {
		where: Prisma.UserWhereUniqueInput;
		data: Prisma.UserUpdateInput;
	}): Promise<User> {
		const { where, data } = params;
		return this.prisma.user.update({
			data,
			where,
		});
	}

	async deleteUser(where: Prisma.UserWhereUniqueInput): Promise<User> {
		return this.prisma.user.delete({
			where,
		});
	}

	async findOrCreate(data: Prisma.UserCreateInput): Promise<User> {
		let user = await this.user({login: data.login});
		if (user)
			return user
		user = await this.createUser(data)
		this.generateTwoFactorAuthenticationSecret(user)
		return user
	}

	async setTwoFactorAuthenticationSecret(secret: string, otpauthUrl: string, userId: number) {
		this.updateUser({
			where: {
				id: Number(userId)
			},
			data: {
				TFASecret: secret,
				otpauthUrl: otpauthUrl
			}
		})
	}

	generateQrCodeDataURL(otpAuthUrl: string) {
		return toDataURL(otpAuthUrl);
	}

	async generateTwoFactorAuthenticationSecret(user: User) {
		const secret = authenticator.generateSecret();
	
		const otpauthUrl = authenticator.keyuri(user.email, 'FT_TRANSCENDANCE', secret);
		await this.setTwoFactorAuthenticationSecret(secret, otpauthUrl, user.id);
	
		return {
		  secret,
		  otpauthUrl
		}
	}
}
