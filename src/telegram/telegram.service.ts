import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TelegramService {

  constructor(private http: HttpService, private configService: ConfigService) {}

  /**
   * Sends a message to a Telegram chat using the Telegram Bot API.
   * 
   * @param text - The message text to be sent.
   */
  async sendMessage(text: string) {
    const token = this.configService.get<string>('TELEGRAM_BOT_TOKEN');
    const chatId = this.configService.get<string>('TELEGRAM_CHAT_ID');
    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    await firstValueFrom(this.http.post(url, { chat_id: chatId, text }));
  }
}
