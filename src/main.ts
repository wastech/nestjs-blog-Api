import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from './pipes/validation.pipe';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import * as compression from 'compression';
import * as csurf from 'csurf';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
  .setTitle('Blog API')
  .setDescription('A Blog App API')
  .setVersion('1.0')
  .addTag('cats')
  .build();
const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api', app, document)

  // Apply Helmet middleware to all requests
  app.use(helmet());
  app.use(compression());
  // app.use(csurf());
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
