import * as dotenv from 'dotenv';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as helmet from 'helmet';
import { DispatchError } from './shared';
import { AppModule } from './app.module';
import { configService } from './shared/config/configService';

dotenv.config({ path: `.env/${process.env.NODE_ENV || 'development'}.env` });

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: true,
    credentials: true,
  });
  app.setGlobalPrefix('api');
  app.use(helmet());

  const options = new DocumentBuilder()
    .setTitle('Example Project REST Docs')
    .setDescription('REST docs for Example Project Api')
    .setVersion('1.0')
    .addTag('users')
    .addTag('auth')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api/docs', app, document);
  app.useGlobalFilters(new DispatchError());
  await app.listen(configService.getPort());
}
bootstrap();
