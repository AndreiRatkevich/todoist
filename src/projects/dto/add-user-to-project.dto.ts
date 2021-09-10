import { IsNumber } from 'class-validator';

export class AddUserToProjectDto {
  @IsNumber({}, { each: true })
  ids: number[];
}
