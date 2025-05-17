import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { Alert } from './alerts/alert.entity';
import { PricesService } from './prices/prices.service';
import { PricesController } from './prices/prices.controller';
import { TelegramService } from './telegram/telegram.service';
import { AlertsModule } from './alerts/alerts.module';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'password',
      database: 'crypto',
      entities: [Alert],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Alert]),
    AlertsModule,
  ],
  controllers: [PricesController],
  providers: [PricesService, TelegramService],
})
export class AppModule {}
