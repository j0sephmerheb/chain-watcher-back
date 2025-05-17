import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import * as dayjs from 'dayjs';

@Injectable()
export class PricesService {
  constructor(private http: HttpService) {}

  async fetchPrices(coin: string) {
    const { data } = await firstValueFrom(
      this.http.get(`https://api.coingecko.com/api/v3/coins/${coin}/market_chart?vs_currency=usd&days=1`)
    );

    const cleaned = data.prices
      .map(([timestamp, price]) => ({
        time: dayjs(timestamp).format("YYYY-MM-DD  HH:mm"),
        price: +price.toFixed(3),
      }))
      .filter((_, i) => i % 5 === 0);

    const first = cleaned[0].price;
    const last = cleaned.at(-1).price;
    const percentage = +(((last - first) / first) * 100).toFixed(3);
    const direction = percentage >= 0 ? 'up' : 'down';

    return {
      prices: cleaned,
      first,
      last,
      percentage,
      direction
    };
  }
}
