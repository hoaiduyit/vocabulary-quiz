import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../users/user.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UserService,
        private readonly jwtService: JwtService
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
}
