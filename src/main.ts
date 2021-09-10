import * as path from 'path';
import * as fs from 'fs';
import * as express from 'express';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import * as http from 'http';
import * as https from 'https';

async function bootstrap() {
  const privateKeyPath = path.join(__dirname, 'secrets', 'private-key.key');
  const certificatePath = path.join(
    __dirname,
    'secrets',
    'public-certificate.crt',
  );
  const privateKey = fs.readFileSync(privateKeyPath, 'utf8');
  const certificate = fs.readFileSync(certificatePath, 'utf8');
  const httpsOptions = { key: privateKey, cert: certificate };

  const server = express();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  await app.init();

  const PORT = 3000;

  http.createServer(server).listen(PORT);
  https.createServer(httpsOptions, server).listen(443);
}

bootstrap();
