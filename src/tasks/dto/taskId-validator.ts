import { IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class TaskIdParam {
  @Type(() => Number)
  @IsNumber()
  id: number;

  @Type(() => String)
  @IsString()
  hrem: string;
}
