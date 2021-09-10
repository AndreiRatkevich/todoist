import { IsNumberString } from 'class-validator';

export class FindOneParams {
  @IsNumberString()
  projectId?: number;

  @IsNumberString()
  taskId?: number;
}
