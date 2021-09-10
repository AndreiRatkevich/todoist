import { Body, Injectable, Req } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CreateTaskDto } from '../tasks/dto/create-task.dto';
import { RequestWithUser } from '../authentication/requestWithUser.interface';
import { CreateProjectDto } from '../projects/dto/create-project.dto';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { TasksService } from '../tasks/tasks.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { EmailService } from '../email/email.service';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentRepo: Repository<Comment>,
    private readonly usersService: UsersService,
    private readonly tasksService: TasksService,
    private readonly emailService: EmailService,
  ) {}

  async createComment(
    user: User,
    projectId: number,
    taskId: number,
    comment: CreateCommentDto,
  ) {
    if (comment.mentionedUsers) {
      console.log(comment.mentionedUsers);
    }
    const author = await this.usersService.getById(user.id);
    const task = await this.tasksService.getTaskById(projectId, taskId);
    const newComment = await this.commentRepo.create({
      ...comment,
      author,
      task,
    });
    await this.commentRepo.save(newComment);
    return newComment;
  }
}
