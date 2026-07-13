import { Injectable } from '@nestjs/common';
import { CreateToneDto } from './dto/create-tone.dto';
import { UpdateToneDto } from './dto/update-tone.dto';

@Injectable()
export class ToneService {
  create(createToneDto: CreateToneDto) {
    return 'This action adds a new tone';
  }

  findAll() {
    return `This action returns all tone`;
  }

  findOne(id: number) {
    return `This action returns a #${id} tone`;
  }

  update(id: number, updateToneDto: UpdateToneDto) {
    return `This action updates a #${id} tone`;
  }

  remove(id: number) {
    return `This action removes a #${id} tone`;
  }
}
