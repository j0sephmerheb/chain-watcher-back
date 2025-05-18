import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class TelegramService {
  private readonly token = 'BOT_TOKEN';
  private readonly chatId = 'CHAT_ID';

  constructor(private http: HttpService) {}

  async sendMessage(text: string) {
    const url = `https://api.telegram.org/bot${this.token}/sendMessage`;
    await firstValueFrom(this.http.post(url, { chat_id: this.chatId, text }));
  }
}
