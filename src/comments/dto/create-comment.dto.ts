import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { Body, Param, Post, Req, UseGuards } from '@nestjs/common';
import { AccessGuard } from '../../authentication/access.guard';
import { RequestWithUser } from '../../authentication/requestWithUser.interface';
import { CreateTaskDto } from '../../tasks/dto/create-task.dto';

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  text: string;

  @IsOptional()
  mentionedUsers?: number[];
}
