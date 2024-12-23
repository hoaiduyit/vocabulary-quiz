import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn
} from 'typeorm';
import { User } from 'src/modules/users/entities/users.enity';
import { Room } from 'src/modules/rooms/entities/room.entity';

@Entity('t_scoreboard')
export class Scoreboard {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'score', type: 'int', default: 0 })
    score: number;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @ManyToOne(() => User, (user) => user.scoreboards, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @ManyToOne(() => Room, (room) => room.scoreboards, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'room_id' })
    room: Room;
}
