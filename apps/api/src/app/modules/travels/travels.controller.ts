import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { GetHttpOptions } from '../../core/decorators';
import { QueryParamsDto } from '../../core/dto';
import { DbTransactionInterceptor } from '../../core/interceptors';
import type { HttpOptions } from '../../core/interfaces';
import { stringToMongoId } from '../../core/utils';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateTravelDto } from './dto/create-travel.dto';
import { UpdateTravelStatusDto } from './dto/update-travel-status.dto';
import { UpdateTravelDto } from './dto/update-travel.dto';
import { TravelsService } from './travels.service';

@Controller('')
@UseGuards(JwtAuthGuard)
@UseInterceptors(DbTransactionInterceptor)
export class TravelsController {
  constructor(private readonly travelsService: TravelsService) { }

  @Get('status')
  async getTravelStatus(@GetHttpOptions() options: HttpOptions) {
    return await this.travelsService.getTravelStatus(options);
  }

  @UsePipes(new ValidationPipe({ transform: true }))
  @Post()
  async create(@Body() createTravelDto: CreateTravelDto, @GetHttpOptions() options: HttpOptions) {
    return await this.travelsService.create(createTravelDto, options);
  }

  @Get()
  async findAll(@Query() queryParams: QueryParamsDto<this>, @GetHttpOptions() options: HttpOptions) {
    return await this.travelsService.findAll(queryParams, options);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @GetHttpOptions() options: HttpOptions) {
    return await this.travelsService.findOne(stringToMongoId(id), options);
  }

  @Put(':id/status')
  async updateStatus(@Param('id') id: string, @Body() updateTravelStatusDto: UpdateTravelStatusDto, @GetHttpOptions() options: HttpOptions) {
    return await this.travelsService.updateStatus(stringToMongoId(id), updateTravelStatusDto, options);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateTravelDto: UpdateTravelDto, @GetHttpOptions() options: HttpOptions) {
    return await this.travelsService.update(stringToMongoId(id), updateTravelDto, options);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @GetHttpOptions() options: HttpOptions) {
    return await this.travelsService.remove(stringToMongoId(id), options);
  }
}
