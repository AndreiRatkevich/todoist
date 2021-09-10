import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project } from './entities/project.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { ProjectUsers } from './entities/projectUsers.entity';
import { AddUserToProjectDto } from './dto/add-user-to-project.dto';
import * as path from 'path';
import * as fs from 'fs';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as http from 'http';
import * as https from 'https';
import * as express from 'express';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectRepo: Repository<Project>,
    @InjectRepository(ProjectUsers)
    private projectUsersRepo: Repository<ProjectUsers>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async createProject(user: User, project: CreateProjectDto) {
    const newProject = await this.projectRepo.create({
      ...project,
      users: [user],
    });
    await this.projectRepo.save(newProject);
    return newProject;
  }

  async getAllProjects(user: User) {
    const userInfo = await this.userRepo.findOne({
      relations: ['projects'],
      where: { id: user.id },
    });
    return userInfo.projects;
  }

  async getProjectById(projectId: number) {
    return await this.projectRepo.findOne(projectId);
  }

  async updateProject(
    user: User,
    projectId: number,
    project: UpdateProjectDto,
  ) {
    await this.projectRepo.update(projectId, project);
    return await this.projectRepo.findOne(projectId);
  }

  async removeProject(user: User, projectId: number) {
    await this.projectRepo.delete(projectId);
  }

  async searchForProjects(user: User, search: string) {
    let projects = await this.projectUsersRepo
      .createQueryBuilder('project_users')
      .innerJoinAndSelect('project_users.project', 'projects')
      .where('project_users.userId = :userId', { userId: user.id })
      .andWhere('projects.title ILIKE :title', { title: `%${search}%` })
      .getMany();

    return projects.map((project) => project.project);
  }

  async checkingAccess(userId: number, projectId: number) {
    return await this.projectUsersRepo.find({
      where: { userId: userId, projectId: projectId },
    });
  }

  async addUsersToProject(
    user: User,
    projectId: number,
    users: AddUserToProjectDto,
  ) {
    const projectUserIds = users.ids.map((id: number) => {
      const projectUserIds = {};
      projectUserIds['projectId'] = projectId;
      projectUserIds['userId'] = id;
      return projectUserIds;
    });

    const projectUsers = await this.projectUsersRepo
      .createQueryBuilder()
      .insert()
      .into(ProjectUsers)
      .values(projectUserIds)
      .execute();
    return projectUsers.identifiers;
  }
}
