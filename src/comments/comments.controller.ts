import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  ClassSerializerInterceptor,
  UseGuards,
  Req,
  Param,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { AccessGuard } from '../authentication/access.guard';
import { RequestWithUser } from '../authentication/requestWithUser.interface';
import { CreateTaskDto } from '../tasks/dto/create-task.dto';

@Controller('projects/:projectId/tasks/:taskId/comments')
@UseInterceptors(ClassSerializerInterceptor)
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @UseGuards(AccessGuard)
  createComment(
    @Req() req: RequestWithUser,
    @Param('taskId') taskId: string,
    @Param('projectId') projectId: string,
    @Body() comment: CreateCommentDto,
  ) {
    return this.commentsService.createComment(
      req.user,
      +projectId,
      +taskId,
      comment,
    );
  }
}
