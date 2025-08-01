import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Health')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('healthcheck')
  @ApiOperation({ summary: 'Check the health status' })
  @ApiResponse({ status: 200, description: 'API Status' })
  healthcheck(): Object {
    return this.appService.healthcheck();
  }
}
