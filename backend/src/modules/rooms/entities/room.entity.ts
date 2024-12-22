import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    Index,
    ManyToMany,
    JoinTable,
    OneToMany
} from 'typeorm';
import { Scoreboard } from 'src/modules/scoreBoards/entities/scoreboard.entity';
import { User } from 'src/modules/users/entities/users.enity';
import { CommonStatus } from 'src/utils/constants';

@Entity('t_room')
@Index(['code'], { unique: true })
export class Room {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'code' })
    code: string;

    @Column({ name: 'status', default: CommonStatus.ACTIVE })
    status: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @Column({ name: 'host_id' })
    hostId: string;

    @ManyToMany(() => User, (user) => user.rooms, { cascade: true })
    @JoinTable({ name: 'room_participants' })
    participants: User[];

    @OneToMany(() => Scoreboard, (scoreboard) => scoreboard.room, { cascade: true })
    scoreboards: Scoreboard[];
}
