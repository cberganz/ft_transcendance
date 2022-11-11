import { User } from 'src/database/user.entity';
export declare class Games {
    id: number;
    player1: User;
    player2: User;
    player1_score: number;
    player2_score: number;
    winner: User;
    start_time: Date;
}
