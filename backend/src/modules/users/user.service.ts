import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpStatusCode } from 'axios';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/users.enity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRole, CommonStatus } from 'src/utils/constants';
import { DeactivateDto } from './dto/deactivate-account.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private UserRepository: Repository<User>
    ) {}

    private async findPrivateAccount(id: string): Promise<User | null> {
        const user = await this.UserRepository.createQueryBuilder('user')
            .where('user.id = :id', { id })
            .andWhere('user.deleted = false')
            .getOne();
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return user;
    }

    private async findOneById(id: string): Promise<User | null> {
        const user = await this.UserRepository.createQueryBuilder('user')
            .select(['user.id', 'user.email', 'user.displayName', 'user.createdAt'])
            .where('user.id = :id', { id })
            .andWhere('user.deleted = false')
            .getOne();
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return user;
    }

    async findLoggedInUserProfile(id: string): Promise<User | null> {
        const user = await this.UserRepository.createQueryBuilder('user')
            .select([
                'user.id',
                'user.email',
                'user.username',
                'user.displayName',
                'user.status',
                'user.createdAt',
                'user.updatedAt'
            ])
            .where('user.id = :id', { id })
            .andWhere('user.deleted = false')
            .getOne();
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return user;
    }

    async findOne(id: string): Promise<User | null> {
        return await this.findOneById(id);
    }

    async findByUsername(username: string): Promise<User | null> {
        const user = await this.UserRepository.createQueryBuilder('user')
            .where('user.username = :username', { username })
            .andWhere('user.deleted = false')
            .getOne();
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return user;
    }

    async create(body: CreateUserDto): Promise<{ id: string; displayName: string }> {
        const existedUserName = await this.UserRepository.createQueryBuilder('user')
            .where("user.username = :username AND user.username IS NOT NULL AND user.username != ''", {
                username: body.username
            })
            .getOne();

        const existedUserEmail = await this.UserRepository.createQueryBuilder('user')
            .where("user.email = :email AND user.email IS NOT NULL AND user.email != ''", { email: body.email })
            .getOne();
        if (existedUserEmail) {
            throw new ForbiddenException('Email already registered');
        }
        if (existedUserName) {
            throw new ForbiddenException('User already existed');
        }
        if (body.username && body.email && body.password && body.confirmPassword && body.displayName) {
            if (body.password !== body.confirmPassword) {
                throw new BadRequestException('Confirm password does not match');
            }
            body.role = UserRole.REGISTERED;
            body.password = await bcrypt.hash(body.password, 10);
        }
        const newData = this.UserRepository.create(body);
        const savedData = await this.UserRepository.save(newData);
        return {
            id: savedData.id,
            displayName: savedData.displayName
        };
    }

    async update(id: string, body: UpdateUserDto): Promise<string> {
        const user = await this.findPrivateAccount(id);
        switch (user.role) {
            case UserRole.GUEST: {
                if (!body.displayName) {
                    throw new BadRequestException('Display name cannot be empty');
                }
                user.displayName = body.displayName;
                if (body.email && body.username && body.password && body.confirmPassword) {
                    const comparedPassword = await bcrypt.compare(body.password, user.password);
                    const isConfirmPasswordMatch = body.password === body.confirmPassword;
                    if (!comparedPassword) {
                        throw new BadRequestException('Password is incorrect');
                    }
                    if (!isConfirmPasswordMatch) {
                        throw new BadRequestException('Confirm password does not match');
                    }
                    user.email = body.email;
                    user.username = body.username;
                    user.password = await bcrypt.hash(body.password, 10);
                    user.role = UserRole.REGISTERED;
                }
                const updatedUser = await this.UserRepository.save(user);
                return updatedUser.id;
            }
            case UserRole.REGISTERED: {
                user.email = body.email;
                user.displayName = body.displayName;
                const updatedUser = await this.UserRepository.save(user);
                return updatedUser.id;
            }
            default:
                break;
        }
    }

    async deactivateAccount(id: string, body: DeactivateDto): Promise<number> {
        const user = await this.findPrivateAccount(id);
        const comparedPassword = await bcrypt.compare(body.password, body.confirmPassword);
        if (!comparedPassword) {
            throw new BadRequestException('Confirm password do not match');
        }
        user.status = CommonStatus.DEACTIVE;
        await this.UserRepository.save(user);
        return HttpStatusCode.Ok;
    }
}
