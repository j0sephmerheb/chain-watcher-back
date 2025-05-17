import { Controller, Get, Param } from '@nestjs/common';
import { PricesService } from './prices.service';

@Controller('prices')
export class PricesController {
  constructor(private readonly service: PricesService) {}

  @Get(':coin')
  getPrices(@Param('coin') coin: string) {
    console.log(`Fetching prices for ${coin}`);
    
    return this.service.fetchPrices(coin);
  }
}
