import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Alert, Direction } from './alert.entity';
import { PricesService } from 'src/prices/prices.service';

@Injectable()
export class AlertsService {
  constructor(
    @InjectRepository(Alert)
    private readonly alertRepo: Repository<Alert>,
    private readonly pricesService: PricesService,
  ) {}

  async findAll() {
    return this.alertRepo.find({
      order: { createdAt: 'DESC' },
    });
  }
  
  async findByCoin(coin: string) {
    return this.alertRepo.find({
      where: { coin },
      order: { createdAt: 'DESC' },
    });
  }

  async create(data: Partial<Alert>) {
    const alert = this.alertRepo.create(data);
    return this.alertRepo.save(alert);
  }

  async delete(id: number) {
    return this.alertRepo.delete(id);
  }

  async toggleActive(id: number) {
    const alert = await this.alertRepo.findOneBy({ id });
    if (!alert) return null;
    alert.active = !alert.active;
    return this.alertRepo.save(alert);
  }

  async checkAndTriggerAlerts(coin: string, priceData: any) {
    if (!priceData?.prices?.length) {
      return { message: 'No price data found' };
    }
  
    const { percentage } = priceData;
    const direction = percentage >= 0 ? Direction.UP : Direction.DOWN;
  
    const activeAlerts = await this.alertRepo.find({
      where: { coin, active: true, direction },
    });
  
    const triggeredAlerts = activeAlerts.filter(alert => {
      const alertPerc = Math.abs(alert.percentage);
      const currentPerc = Math.abs(percentage);
      return alertPerc > 0 && alertPerc <= currentPerc;
    });
  
    if (triggeredAlerts.length) {
      await Promise.all(triggeredAlerts.map(alert => {
        alert.active = false;
        return this.alertRepo.save(alert);
      }));
    }
  
    return {
      coin,
      currentPercentage: percentage,
      direction,
      triggeredAlerts
    };
  }
  
  async checkAndTriggerAllAlerts() {
    const activeAlerts = await this.alertRepo.find({ where: { active: true } });
  
    const alertsByCoin = activeAlerts.reduce((acc, alert) => {
      (acc[alert.coin] ??= []).push(alert);
      return acc;
    }, {} as Record<string, Alert[]>);
  
    // Explicitly type the results array
    const results: {
      coin: string;
      currentPercentage: number;
      direction: Direction;
      triggeredAlerts: Alert[];
    }[] = [];
  
    for (const coin of Object.keys(alertsByCoin)) {
      const priceData = await this.pricesService.fetchPrices(coin);
      if (!priceData?.prices.length) continue;
  
      const { percentage } = priceData;
      const direction = percentage >= 0 ? Direction.UP : Direction.DOWN;
  
      const coinAlerts = alertsByCoin[coin].filter(
        alert => alert.direction === direction
      );
  
      const triggeredAlerts = coinAlerts.filter(alert => {
        const alertPerc = Math.abs(alert.percentage);
        const currentPerc = Math.abs(percentage);
        return alertPerc > 0 && alertPerc <= currentPerc;
      });
  
      if (triggeredAlerts.length) {
        await Promise.all(
          triggeredAlerts.map(alert => {
            alert.active = false;
            return this.alertRepo.save(alert);
          }),
        );
      }
  
      results.push({
        coin,
        currentPercentage: percentage,
        direction,
        triggeredAlerts,
      });
    }
  
    return results;
  }
}
