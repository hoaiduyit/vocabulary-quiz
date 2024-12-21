import { Injectable } from '@nestjs/common';

@Injectable()
export class ConfigService {
    private readonly envConfig: { [key: string]: any } = null;

    constructor() {
        this.envConfig = {
            accessTokenSecret: process.env.ACCESS_TOKEN_SECRET
        };
    }

    get(key: string): any {
        return this.envConfig[key];
    }
}
