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
import { Message as MessageMode1 } from '@prisma/client';

@Controller('message')
export class MessageController {
	constructor(private readonly messageService: MessageService) {}

	@Get(':id')
	async getMessageById(@Param('id') id: string): Promise<MessageMode1> {
		return this.messageService.message({ id: Number(id) });
	}

	//@Post()
	//async newMessage (
	//	@Body() messageData: { channelId: string; authorId: string; content: string }
	//): Promise<MessageMode1> {
	//	return this.messageService.createMessage(messageData);
	//}

	@Delete(':id')
	async deleteMessage(@Param('id') id: string): Promise<MessageMode1> {
		return this.messageService.deleteMessage({ id: Number(id) });
	}
}
