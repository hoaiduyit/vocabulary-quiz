import { Test, TestingModule } from '@nestjs/testing';
import { JwtStrategy } from './jwt-strategy';

describe('JwtStrategy', () => {
    let provider: JwtStrategy;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [JwtStrategy]
        }).compile();

        provider = module.get<JwtStrategy>(JwtStrategy);
    });

    it('should be defined', () => {
        expect(provider).toBeDefined();
    });
});
