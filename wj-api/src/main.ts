import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

/**
 * CORS com `credentials: true` — é o par do `withCredentials: true` que já
 * configuramos no Axios do frontend (services/api.js). Sem os dois lados
 * combinando, o cookie httpOnly de refresh (Etapa 3) nunca vai trafegar.
 *
 * `origin` vem de variável de ambiente e nunca é "*": com `credentials:
 * true`, o navegador recusa qualquer resposta CORS com origin curinga —
 * então já nasce certo, em vez de alguém "corrigir" isso depois com um
 * `*` que quebra tudo silenciosamente.
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

    const corsOrigins = configService
    .get<string>('CORS_ORIGIN', 'http://localhost:5173')
    .split(',')
    .map((origin) => origin.trim());

  app.enableCors({
    origin: corsOrigins,
    credentials: true,
  });

  /**
   * ValidationPipe GLOBAL — é o que faz os decorators dos DTOs
   * (@IsString, @IsNumber, etc.) realmente rodarem em toda rota da API,
   * não só no módulo de Produtos.
   *   - whitelist: true          -> remove qualquer campo que não esteja
   *                                 declarado no DTO (defesa contra
   *                                 payload poluído/NoSQL injection)
   *   - forbidNonWhitelisted: true -> em vez de só remover em silêncio,
   *                                 rejeita a requisição com 400 se vier
   *                                 campo estranho — mais seguro E mais
   *                                 fácil de debugar
   *   - transform: true          -> converte o JSON cru para uma
   *                                 instância real da classe do DTO
   */
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const port = configService.get<number>('PORT', 3000);
  await app.listen(port);
  // eslint-disable-next-line no-console
  console.log(`wj-api rodando em http://localhost:${port}`);
}

bootstrap();
