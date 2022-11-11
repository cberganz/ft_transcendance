import { User } from 'src/database/user.entity';
import { Channels } from 'src/database/channels.entity';
export declare class Messages {
    id: number;
    channel: Channels;
    author: User;
    date: Date;
    content: string;
}
