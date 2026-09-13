import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './config/database.module';
import { ProductsModule } from './products/products.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    // isGlobal: true -> ConfigService fica disponível em qualquer módulo
    // (Produtos, Pedidos, Auth...) sem precisar reimportar ConfigModule
    // em cada um deles.
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    ProductsModule,
    // Próximas etapas entram aqui: OrdersModule, AuthModule, DashboardModule.
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
