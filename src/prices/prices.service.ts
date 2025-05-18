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
  
    // Map to cleaned time object and rounded price
    const pricesWithTime = data.prices.map(([timestamp, price]) => ({
      timeObj: dayjs(timestamp),
      price: +price.toFixed(3),
    }));
  
    // Coingecko returns 250 pairs over 24 hours → roughly one data point every 5–6 minutes
    // We take the first and last, and sample the middle data points to reduce the size
    // to a more manageable number (31 points)
    const first = pricesWithTime[0];
    const last = pricesWithTime[pricesWithTime.length - 1];
  
    const middleData = pricesWithTime.slice(1, -1); // Exclude first and last
    const middleCount = middleData.length;
  
    let sampledMiddle;
  
    if (middleCount >= 31) {
      const step = Math.floor(middleCount / 31);
      sampledMiddle = middleData.filter((_, i) => i % step === 0 && i < 31 * step);
    } else {
      // Fallback if less than 31 elements
      sampledMiddle = middleData;
    }
  
    // Rebuild final array
    const cleaned = [
      { time: first.timeObj.format("HH:mm"), price: first.price },
      ...sampledMiddle.map(({ timeObj, price }) => ({
        time: timeObj.format("HH:mm"),
        price,
      })),
      { time: last.timeObj.format("HH:mm"), price: last.price },
    ];
  
    const percentage = +(((last.price - first.price) / first.price) * 100).toFixed(3);
    const direction = percentage >= 0 ? 'up' : 'down';
  
    return {
      prices: cleaned,
      first: first.price,
      last: last.price,
      percentage,
      direction
    };
  }
  
}
