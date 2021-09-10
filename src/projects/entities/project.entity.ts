import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { ProjectUsers } from './projectUsers.entity';
import { Task } from '../../tasks/entities/task.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class Project {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public title: string;

  @ManyToMany(() => User, (user: User) => user.projects)
  @JoinTable({
    name: 'project_users',
  })
  @Exclude()
  public users: User[];

  @OneToMany(
    () => ProjectUsers,
    (projectUsers: ProjectUsers) => projectUsers.project,
  )
  public projectUsers: ProjectUsers[];

  @OneToMany(() => Task, (task: Task) => task.project, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  public tasks: Task[];
}
