import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Task } from '../../tasks/entities/task.entity';
import { Exclude } from 'class-transformer';

@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  text: string;

  @ManyToOne(() => User, (author: User) => author.comments)
  @Exclude()
  public author: User;

  @ManyToOne(() => Task, (task: Task) => task.comments)
  @Exclude()
  public task: Task;
}
