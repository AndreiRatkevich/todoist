import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { Repository, ILike } from 'typeorm';
import { Project } from '../projects/entities/project.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private taskRepo: Repository<Task>,
    @InjectRepository(Project)
    private projectRepo: Repository<Project>,
  ) {}

  async createTask(projectId: number, task: CreateTaskDto) {
    const project = await this.projectRepo.findOne({
      where: { id: projectId },
    });
    const newTask = await this.taskRepo.create({
      ...task,
      project,
    });
    await this.taskRepo.save(newTask);
    return newTask;
  }

  async getAllTasks(projectId: number) {
    const project = await this.projectRepo.findOne({
      where: { id: projectId },
    });
    return await this.taskRepo.find({
      where: { project },
    });
  }

  async getTaskById(taskId: number, projectId: number) {
    const project = await this.projectRepo.findOne({
      where: { id: projectId },
    });
    return await this.taskRepo.findOne({ where: { id: taskId, project } });
  }

  async updateTask(taskId: number, task: UpdateTaskDto) {
    await this.taskRepo.update(taskId, task);
    return await this.taskRepo.findOne(taskId);
  }

  async removeTask(taskId: number) {
    await this.taskRepo.delete(taskId);
  }

  async searchForTasks(projectId: number, search: string) {
    const project = await this.projectRepo.findOne({
      where: { id: projectId },
    });
    return await this.taskRepo.find({
      project,
      title: ILike(`%${search}%`),
    });
  }
}
