import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
    ManyToMany,
    JoinTable
} from 'typeorm';
import { Scoreboard } from 'src/modules/rooms/entities/scoreboard.entity';
import { Room } from 'src/modules/rooms/entities/room.entity';
import { Exclude } from 'class-transformer';
import { CommonStatus, UserRole } from 'src/utils/constants';

@Entity('t_user')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'username', nullable: true })
    @Exclude()
    username: string;

    @Column({ name: 'email', nullable: true })
    email: string;

    @Column({ name: 'password', nullable: true })
    @Exclude()
    password: string;

    @Column({ name: 'display_name' })
    displayName: string;

    @Column({ name: 'role', default: UserRole.GUEST })
    role: string;

    @Column({ name: 'status', default: CommonStatus.ACTIVE })
    status: string;

    @Column({ name: 'deleted', default: false })
    deleted: boolean;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @ManyToMany(() => Room, (room) => room.participants)
    @JoinTable({ name: 'user_joined_room' })
    rooms: Room[];

    @OneToMany(() => Scoreboard, (scoreboard) => scoreboard.user, { cascade: true })
    scoreboards: Scoreboard[];
}
