import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToMany,
  OneToMany,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Project } from '../../projects/entities/project.entity';
import { ProjectUsers } from '../../projects/entities/projectUsers.entity';
import { Comment } from '../../comments/entities/comment.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ unique: true })
  public email: string;

  @Column()
  public name: string;

  @Column({ nullable: true })
  @Exclude()
  public password?: string;

  @Column({ default: false })
  @Exclude()
  public isRegisteredWithGoogle: boolean;

  @ManyToMany(() => Project, (project: Project) => project.users, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  public projects: Project[];

  @OneToMany(
    () => ProjectUsers,
    (projectUsers: ProjectUsers) => projectUsers.user,
  )
  public projectUsers: ProjectUsers[];

  @OneToMany(() => Comment, (comment: Comment) => comment.author)
  public comments: Comment[];
}
