import { NestFactory, Reflector } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import WinstonCloudWatch from 'winston-cloudwatch';
import { ValidationPipe, ClassSerializerInterceptor } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      transports: [
        new winston.transports.Console({
          format: winston.format.simple(),
        }),
        ...(process.env.NODE_ENV === 'production'
          ? [
              new WinstonCloudWatch({
                logGroupName: 'books-api',
                logStreamName: `books-api-stream-${new Date().toISOString().split('T')[0]}`,
                awsRegion: process.env.AWS_REGION || 'us-east-1',
                jsonMessage: true,
                retentionInDays: 7,
              }),
            ]
          : []),
      ],
    }),
  });

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  const config = new DocumentBuilder()
    .setTitle('Users API')
    .setDescription('Documentação da API de usuários')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.enableCors();

  await app.listen(3000); 
}
bootstrap();