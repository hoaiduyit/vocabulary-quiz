import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../users/user.service';
import { ConfigService } from 'src/config/config.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UserService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService
    ) {}

    async validateUser(username: string, password: string): Promise<{ userId: string; displayName: string }> {
        const user = await this.usersService.findByUsername(username);
        if (user && (await bcrypt.compare(password, user.password))) {
            return {
                userId: user.id,
                displayName: user.displayName
            };
        }
        throw new UnauthorizedException('Invalid username or password');
    }

    async login({ userId, displayName }: { userId: string; displayName: string }) {
        const payload = { sub: userId, userId, displayName };
        return {
            accessToken: this.jwtService.sign(payload)
        };
    }

    async loginAsGuest({ userId, displayName }: { userId: string; displayName: string }) {
        const payload = { sub: userId, userId, displayName };
        return {
            accessToken: this.jwtService.sign(payload, { secret: this.configService.get('accessTokenSecret') })
        };
    }
}
