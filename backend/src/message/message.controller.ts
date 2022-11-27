import {
	Controller,
	Get,
	Param,
	Post,
	Body,
	Put,
	Delete
} from '@nestjs/common';
import { MessageService } from './message.service';
import {  Message as MessageMode1 } from '@prisma/client';

@Controller('message')
export class MessageController {
	constructor(private readonly messageService: MessageService) {}

	@Get(':id')
	async getMessageById(@Param('id') id: string): Promise<MessageMode1> {
		return this.messageService.message({ id: Number(id) });
	}

	@Post()
	async newMessage (
		@Body() messageData: { channelId: string; authorId: string; content: string }
	): Promise<MessageMode1> {
		const newMsg = await this.messageService.createMessage({
			content: messageData.content,
			channel: { connect: { id: Number(messageData.channelId) } },
			author: { connect: { id: Number(messageData.authorId) } },
		}, Number(messageData.channelId));
		return this.messageService.message({ id: newMsg.id })
	}

	@Delete(':id')
	async deleteMessage(@Param('id') id: string): Promise<MessageMode1> {
		return this.messageService.deleteMessage({ id: Number(id) });
	}
}
