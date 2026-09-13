import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

const READY_STATE_LABELS: Record<number, string> = {
  0: 'desconectado',
  1: 'conectado',
  2: 'conectando',
  3: 'desconectando',
};

@Injectable()
export class AppService {
  constructor(@InjectConnection() private readonly mongoConnection: Connection) {}

  getHealth() {
    return {
      status: 'ok',
      mongo: READY_STATE_LABELS[this.mongoConnection.readyState] ?? 'desconhecido',
      timestamp: new Date().toISOString(),
    };
  }
}
