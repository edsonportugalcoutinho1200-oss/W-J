import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

/**
 * Toda a configuração de conexão com o banco fica isolada aqui — os
 * módulos de negócio (Produtos, Pedidos, etc., nas próximas etapas) nunca
 * precisam saber se o banco é Atlas, local, ou qualquer outra coisa.
 *
 * `MONGO_URI` nunca tem valor padrão aqui de propósito: se faltar no
 * `.env`, é melhor a aplicação recusar subir (erro claro no terminal) do
 * que tentar conectar num "localhost" que ninguém configurou.
 */
@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.getOrThrow<string>('MONGO_URI'),
      }),
    }),
  ],
})
export class DatabaseModule {}
