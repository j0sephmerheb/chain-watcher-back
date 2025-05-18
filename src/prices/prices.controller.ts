import { Controller, Get, Param } from "@nestjs/common";
import { PricesService } from "./prices.service";
import { AlertsService } from "src/alerts/alerts.service";

@Controller("prices")
export class PricesController {
  constructor(
    private readonly service: PricesService,
    private readonly alertsService: AlertsService
  ) {}

  /**
   * Retrieves the prices for a specific cryptocurrency.
   *
   * @param coin - The symbol of the cryptocurrency to fetch prices for.
   * @returns The price data for the specified cryptocurrency.
   */
  @Get(":coin")
  getPrices(@Param("coin") coin: string) {
    return this.service.fetchPrices(coin);
  }

  /**
   * Retrieves the prices for a specific cryptocurrency and checks for alerts.
   *
   * @param coin - The symbol of the cryptocurrency to fetch prices for.
   * @returns An object containing price data, alert results, and all alerts for the cryptocurrency.
   */
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
