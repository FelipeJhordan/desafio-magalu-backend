import { Controller, Get } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { ApiTags } from '@nestjs/swagger';
import {
  HealthCheck,
  HealthCheckResult,
  HealthCheckService,
  MongooseHealthIndicator,
} from '@nestjs/terminus';
import { Connection } from 'mongoose';
import { HEALTH_RESOURCE } from '../constants/health-resource.constants';

@Controller(HEALTH_RESOURCE)
@ApiTags(HEALTH_RESOURCE)
export class HealthController {
  constructor(
    private healthCheck: HealthCheckService,
    private mongooseHealth: MongooseHealthIndicator,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  @Get()
  @HealthCheck()
  async check(): Promise<HealthCheckResult> {
    return this.healthCheck.check(this.mongooseCheckCallback());
  }

  public mongooseCheckCallback() {
    return [
      () =>
        this.mongooseHealth.pingCheck('mongoDB', {
          connection: this.connection,
        }),
    ];
  }
}
