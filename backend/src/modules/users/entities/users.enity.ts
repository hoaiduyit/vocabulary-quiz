import { Exclude } from 'class-transformer';
import { Room } from 'src/modules/rooms/entities/room.entity';
import { UserRole, CommonStatus } from 'src/utils/constants';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToMany } from 'typeorm';

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
    rooms: Room[];
}
