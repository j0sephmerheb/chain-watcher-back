import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import * as dayjs from 'dayjs';

@Injectable()
export class PricesService {
  constructor(private http: HttpService) {}

  /**
   * Fetches the price data for a specific cryptocurrency from the CoinGecko API.
   *
   * @param coin - The symbol of the cryptocurrency to fetch prices for.
   * @returns An object containing cleaned price data, the first and last prices,
   *          the percentage change, and the price direction (up or down).
   */
  async fetchPrices(coin: string) {
    const { data } = await firstValueFrom(
      this.http.get(`https://api.coingecko.com/api/v3/coins/${coin}/market_chart?vs_currency=usd&days=1`)
    );

    const pricesWithTime = data.prices.map(([timestamp, price]) => ({
      timeObj: dayjs(timestamp),
      price: +price.toFixed(3),
    }));
    
    const firstTime = pricesWithTime[0].timeObj;

    const filtered = pricesWithTime.filter(({ timeObj }, i) => {
      // Always keep first and last
      if (i === 0 || i === pricesWithTime.length - 1) return true;
    
      // Calculate difference in minutes from first time
      const diffMinutes = timeObj.diff(firstTime, "minute");
    
      // Keep only if diffMinutes is multiple of 5
      return diffMinutes % 5 === 0;
    });
    
    const cleaned = filtered.map(({ timeObj, price }) => ({
      time: timeObj.format("HH:mm"),
      price,
    }));
    

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
