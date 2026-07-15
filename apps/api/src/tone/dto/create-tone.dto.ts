import { IsInt } from 'class-validator';

export class CreateToneDto {
  @IsInt()
  sale_count;

  @IsInt()
  WARM;

  @IsInt()
  COOL;

  @IsInt()
  SPRINGWARM;

  @IsInt()
  SUMMERCOOL;

  @IsInt()
  FALLWARM;

  @IsInt()
  WINTERCOOL;

  @IsInt()
  FALLDEEP;

  @IsInt()
  WINTERDEEP;

  @IsInt()
  SUMMERMUTE;

  @IsInt()
  FALLMUTE;
}
