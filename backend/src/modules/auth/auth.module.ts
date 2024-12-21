import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../users/user.module';
import { ConfigService } from 'src/config/config.service';
import { ConfigModule } from 'src/config/config.module';

@Module({
    imports: [
        PassportModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                secret: configService.get('accessTokenSecret'),
                signOptions: { expiresIn: '7d' }
            }),
            inject: [ConfigService]
        }),
        forwardRef(() => UserModule)
    ],
    providers: [AuthService],
    controllers: [AuthController]
})
export class AuthModule {}
