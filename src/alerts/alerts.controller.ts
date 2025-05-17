import {
  Controller,
  Post,
  Body,
  Delete,
  Param,
  Patch,
  Get,
  Query,
} from '@nestjs/common';
import { AlertsService } from './alerts.service';
import { Alert } from './alert.entity';

@Controller('alerts')
export class AlertsController {
  constructor(private readonly alertsService: AlertsService) {}

  @Get()
  getAlerts(@Query('coin') coin: string) {
    return this.alertsService.findByCoin(coin);
  }

  @Get('all')
  getAllAlerts() {
    return this.alertsService.findAll();
  }

  @Post()
  createAlert(@Body() alertData: Partial<Alert>) {
    return this.alertsService.create(alertData);
  }

  @Delete(':id')
  deleteAlert(@Param('id') id: number) {
    return this.alertsService.delete(id);
  }

  @Patch(':id/toggle')
  toggleAlert(@Param('id') id: number) {
    return this.alertsService.toggleActive(id);
  }

  @Get('check-active')
  async checkActiveAlerts(@Query('coin') coin: string) {
    return this.alertsService.checkAndTriggerAlerts(coin);
  }
  
  @Get('check-trigger-all')
  async checkAndTriggerAll() {
    return this.alertsService.checkAndTriggerAllAlerts();
  }
}
