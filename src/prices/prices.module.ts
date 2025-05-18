// prices.module.ts
import { forwardRef, Module } from "@nestjs/common";
import { PricesService } from "./prices.service";
import { PricesController } from "./prices.controller";
import { AlertsModule } from "src/alerts/alerts.module";
import { HttpModule } from "@nestjs/axios";

@Module({
  imports: [
    HttpModule,
    forwardRef(() => AlertsModule),
  ],
  providers: [PricesService],
  controllers: [PricesController],
  exports: [PricesService],
})
export class PricesModule {}
