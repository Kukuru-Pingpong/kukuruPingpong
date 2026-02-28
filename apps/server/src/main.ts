import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      process.env.FRONTEND_URL,
    ].filter(Boolean) as string[],
    credentials: true,
  });
  const port = process.env.PORT || 4000;
  await app.listen(port);
  console.log(`Voice Battle 백엔드 실행 중: http://localhost:${port}`);
}
bootstrap();
