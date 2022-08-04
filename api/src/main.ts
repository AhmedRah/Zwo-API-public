import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const prefix = `api/v${process.env.API_VERSION || 1}`;
  app.setGlobalPrefix(prefix);

  const config = new DocumentBuilder()
    .setTitle('Swaggy swagger')
    .setDescription('The ZWO API swagger')
    .setVersion(`v${process.env.API_VERSION || 1}`)
    .setBasePath(prefix)
    .addTag('auth')
    .addTag('animals-breeds')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  await app.listen(3000);
}
bootstrap();
