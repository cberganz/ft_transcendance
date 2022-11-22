import { Controller, Render, Get, Res } from '@nestjs/common';
import { ChatService } from './chat.service';
 
@Controller()
export class ChatController {
    constructor(private readonly ChatService: ChatService) {}
    
    @Get('/chat')
    @Render('index') 
    Home() {
        return;
    }
}