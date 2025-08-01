import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  healthcheck(): Object {
    return {
      status: 'ok',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    };
  }
}
