import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

/**
 * GET /health — a rota de diagnóstico da aplicação como um todo. Rotas de
 * negócio (produtos, pedidos, etc.) ficam cada uma no seu próprio módulo
 * (ver src/products/, por exemplo), nunca soltas aqui.
 */
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('health')
  getHealth() {
    return this.appService.getHealth();
  }
}
