import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';
import * as cookieParser from 'cookie-parser';
import * as useragent from 'express-useragent';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    app.use(express.json({ limit: '10mb' }));
    app.use(cookieParser());
    app.use(useragent.express());
    app.useGlobalPipes(new ValidationPipe());
    app.enableCors({
        credentials: true,
        origin: true
    });
    app.setGlobalPrefix('api');

    const config = new DocumentBuilder()
        .setTitle('API Document')
        .setDescription('API')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api-docs', app, document);

    await app.listen(8000);
}
bootstrap();
