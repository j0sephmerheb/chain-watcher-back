// prices.module.ts
import { Module } from '@nestjs/common';
import { PricesService } from './prices.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [PricesService],
  exports: [PricesService],
})
export class PricesModule {}
