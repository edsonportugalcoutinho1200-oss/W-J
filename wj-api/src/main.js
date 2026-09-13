"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const core_1 = require("@nestjs/core");
const config_1 = require("@nestjs/config");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const configService = app.get(config_1.ConfigService);
    app.enableCors({
        origin: configService.get('CORS_ORIGIN', 'http://localhost:5173'),
        credentials: true,
    });
    const port = configService.get('PORT', 3000);
    await app.listen(port);
    console.log(`wj-api rodando em http://localhost:${port}`);
}
bootstrap();
//# sourceMappingURL=main.js.map