import { Column, Entity, PrimaryColumn, ManyToOne } from 'typeorm';
import { IsNotEmpty } from 'class-validator';
import { Project } from './project.entity';
import { User } from '../../users/entities/user.entity';
import { Exclude } from 'class-transformer';

@Entity('project_users')
export class ProjectUsers {
  @Column()
  @IsNotEmpty()
  @PrimaryColumn()
  @Exclude()
  public projectId: string;

  @Column()
  @IsNotEmpty()
  @PrimaryColumn()
  @Exclude()
  public userId: string;

  @ManyToOne(() => Project, (project: Project) => project.projectUsers, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  public project: Project;

  @ManyToOne(() => User, (user: User) => user.projectUsers, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @Exclude()
  public user: User;
}
