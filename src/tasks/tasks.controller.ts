import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { RequestWithUser } from '../authentication/requestWithUser.interface';
import { AccessGuard } from '../authentication/access.guard';

@Controller('projects/:projectId/tasks')
@UseInterceptors(ClassSerializerInterceptor)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @UseGuards(AccessGuard)
  createTask(
    @Req() req: RequestWithUser,
    @Param('projectId') projectId: string,
    @Body() task: CreateTaskDto,
  ) {
    return this.tasksService.createTask(+projectId, task);
  }

  @Get()
  @UseGuards(AccessGuard)
  getAllTasks(
    @Req() req: RequestWithUser,
    @Param('projectId') projectId: string,
    @Query('search') search: string,
  ) {
    if (search) {
      return this.tasksService.searchForTasks(+projectId, search);
    }
    return this.tasksService.getAllTasks(+projectId);
  }

  @Get(':taskId')
  @UseGuards(AccessGuard)
  getTaskById(
    @Req() req: RequestWithUser,
    @Param('taskId') taskId: string,
    @Param('projectId') projectId: string,
  ) {
    return this.tasksService.getTaskById(+taskId, +projectId);
  }

  @Patch(':taskId')
  @UseGuards(AccessGuard)
  updateTask(
    @Req() req: RequestWithUser,
    @Param('projectId') projectId: string,
    @Param('taskId') taskId: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    return this.tasksService.updateTask(+taskId, updateTaskDto);
  }

  @Delete(':taskId')
  @UseGuards(AccessGuard)
  removeTask(
    @Req() req: RequestWithUser,
    @Param('projectId') projectId: string,
    @Param('taskId') taskId: string,
  ) {
    return this.tasksService.removeTask(+taskId);
  }
}
