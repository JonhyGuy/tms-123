import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { BoxesService } from './boxes.service';
import { CreateBoxDto } from './dto/create-box.dto';
import { UpdateBoxDto } from './dto/update-box.dto';

@Controller('')
export class BoxesController {
  constructor(private readonly boxesService: BoxesService) { }

  @Post()
  create(@Body() createBoxDto: CreateBoxDto) {
    return this.boxesService.create(createBoxDto);
  }

  @Get()
  findAll() {
    return this.boxesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.boxesService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateBoxDto: UpdateBoxDto) {
    return this.boxesService.update(+id, updateBoxDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.boxesService.remove(+id);
  }
}
