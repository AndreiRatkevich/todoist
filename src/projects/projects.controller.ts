import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  Req,
  Delete,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { JwtAuthenticationGuard } from '../authentication/jwt-authentication.guard';
import { RequestWithUser } from '../authentication/requestWithUser.interface';
import { AddUserToProjectDto } from './dto/add-user-to-project.dto';
import { AccessGuard } from '../authentication/access.guard';

@Controller('projects')
@UseInterceptors(ClassSerializerInterceptor)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @UseGuards(JwtAuthenticationGuard)
  createProject(
    @Req() req: RequestWithUser,
    @Body() project: CreateProjectDto,
  ) {
    return this.projectsService.createProject(req.user, project);
  }

  @Get()
  @UseGuards(JwtAuthenticationGuard)
  getAllProjects(@Req() req: RequestWithUser, @Query('search') search: string) {
    if (search) {
      return this.projectsService.searchForProjects(req.user, search);
    }
    return this.projectsService.getAllProjects(req.user);
  }

  @Get(':projectId')
  @UseGuards(AccessGuard)
  getProjectById(
    @Req() req: RequestWithUser,
    @Param('projectId') projectId: string,
  ) {
    return this.projectsService.getProjectById(+projectId);
  }

  @Post(':projectId')
  @UseGuards(AccessGuard)
  addUsersToProject(
    @Req() req: RequestWithUser,
    @Param('projectId') projectId: string,
    @Body() users: AddUserToProjectDto,
  ) {
    return this.projectsService.addUsersToProject(req.user, +projectId, users);
  }

  @Patch(':projectId')
  @UseGuards(AccessGuard)
  updateProject(
    @Req() req: RequestWithUser,
    @Param('projectId') projectId: string,
    @Body() project: UpdateProjectDto,
  ) {
    return this.projectsService.updateProject(req.user, +projectId, project);
  }

  @Delete(':projectId')
  @UseGuards(AccessGuard)
  removeProject(
    @Req() req: RequestWithUser,
    @Param('projectId') projectId: string,
  ) {
    return this.projectsService.removeProject(req.user, +projectId);
  }
}
