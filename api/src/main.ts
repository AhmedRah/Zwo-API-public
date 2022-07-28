import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  const config = new DocumentBuilder()
  .setTitle('Swaggy swagger')
  .setDescription('The ZWO API swagger')
  .setVersion('1.0')
  .addTag('dev')
  .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);
  
  app.setGlobalPrefix(`api/v${process.env.API_VERSION || 1}`);
  await app.listen(3000);
}
bootstrap();
