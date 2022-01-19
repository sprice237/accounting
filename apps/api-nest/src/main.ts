/* eslint-disable no-console */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  console.log('Initializing nest');
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env['PORT'] ?? 8080);
  const url = await app.getUrl();
  console.log(`Finished initializing nest, listening on ${url}`);
}
bootstrap();
