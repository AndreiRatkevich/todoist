import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Project } from '../../projects/entities/project.entity';
import { Exclude } from 'class-transformer';
import { Comment } from '../../comments/entities/comment.entity';

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public title: string;

  @Column()
  public text: string;

  @Column({ default: 4 })
  public priority?: number;

  @ManyToOne(() => Project, (project: Project) => project.tasks)
  @Exclude()
  public project: Project;

  @OneToMany(() => Comment, (comment: Comment) => comment.task, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  public comments: Comment[];
}
