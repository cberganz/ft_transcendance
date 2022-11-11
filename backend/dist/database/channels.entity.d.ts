import { User } from 'src/database/user.entity';
export declare class Channels {
    id: number;
    members: User[];
    type: string;
    password: string;
    admin: User[];
    blacklist: User[];
}
