import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ToneService } from './tone.service';
import { CreateToneDto } from './dto/create-tone.dto';
import { UpdateToneDto } from './dto/update-tone.dto';

@Controller('tone')
export class ToneController {
  constructor(private readonly toneService: ToneService) {}

  @Post()
  create(@Body() createToneDto: CreateToneDto) {
    return this.toneService.create(createToneDto);
  }

  @Get()
  findAll() {
    return this.toneService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.toneService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateToneDto: UpdateToneDto) {
    return this.toneService.update(+id, updateToneDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.toneService.remove(+id);
  }
}
