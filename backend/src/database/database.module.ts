import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from 'src/modules/rooms/entities/room.entity';
import { User } from 'src/modules/users/entities/users.enity';

@Global()
@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: 'localhost',
            port: 5432,
            username: 'vocabulary_quiz', // TODO: move to .env
            password: 'vocabulary_quiz', // TODO: move to .env
            database: 'vocabulary_quiz', // TODO: move to .env
            entities: [User, Room],
            synchronize: true
        })
    ]
})
export class DatabaseModule {}
