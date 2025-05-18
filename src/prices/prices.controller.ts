import { Controller, Get, Param } from "@nestjs/common";
import { PricesService } from "./prices.service";
import { AlertsService } from "src/alerts/alerts.service";

@Controller("prices")
export class PricesController {
  constructor(
    private readonly service: PricesService,
    private readonly alertsService: AlertsService
  ) {}

  @Get(":coin")
  getPrices(@Param("coin") coin: string) {
    return this.service.fetchPrices(coin);
  }

  @Get("combined/:coin")
  async getPricesAndCheckAlerts(@Param("coin") coin: string) {
    const priceData = await this.service.fetchPrices(coin);
    const alertResult = await this.alertsService.checkAndTriggerAlerts(coin, priceData);
    const allAlerts = await this.alertsService.findByCoin(coin);

    return {
      ...priceData,
      alertResult: {
        ...alertResult,
        allAlerts,
      },
    };
  }
}
