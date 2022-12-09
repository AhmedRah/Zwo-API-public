import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const version =  process.env.API_VERSION || 'v1';
  app.setGlobalPrefix(`api/${version}`);

  const config = new DocumentBuilder()
    .setTitle('Swaggy swagger')
    .setDescription('The ZWO API swagger')
    .setVersion(version)
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  await app.listen(3000);
}
bootstrap();
