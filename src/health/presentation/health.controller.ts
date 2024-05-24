import { Controller, Get } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import {
  HealthCheck,
  HealthCheckResult,
  HealthCheckService,
  MongooseHealthIndicator,
} from '@nestjs/terminus';
import { Connection } from 'mongoose';

@Controller('health')
export class HealthController {
  constructor(
    private healthCheck: HealthCheckService,
    private mongooseHealth: MongooseHealthIndicator,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  @Get()
  @HealthCheck()
  async check(): Promise<HealthCheckResult> {
    return this.healthCheck.check([
      () =>
        this.mongooseHealth.pingCheck('mongoDB', {
          connection: this.connection,
        }),
    ]);
  }
}
