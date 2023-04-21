import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from './pipes/validation.pipe';
import { AppModule } from './app.module';
import helmet from 'helmet';
import * as compression from 'compression';
import * as csurf from 'csurf';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Apply Helmet middleware to all requests
  app.use(helmet());
  app.use(compression());
  app.use(csurf());
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
