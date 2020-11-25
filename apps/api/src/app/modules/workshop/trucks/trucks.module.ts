import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Truck, TruckSchema } from './schemas/truck.schema';
import { TrucksController } from './trucks.controller';
import { TrucksService } from './trucks.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Truck.name, schema: TruckSchema }])],
  controllers: [TrucksController],
  providers: [TrucksService]
})
export class TrucksModule { }
