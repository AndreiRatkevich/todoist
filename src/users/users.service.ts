import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, getManager } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepo: Repository<User>,
  ) {}

  async getById(id: number) {
    const user = await this.usersRepo.findOne({ id });
    if (user) {
      return user;
    }
    throw new HttpException(
      'User with this id does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  async getByEmail(email: string) {
    const user = await this.usersRepo.findOne({ email });
    if (user) {
      return user;
    }
    throw new HttpException(
      'User with this email does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  async create(userData: CreateUserDto) {
    const newUser = await this.usersRepo.create({
      ...userData,
    });
    await this.usersRepo.save(newUser);
    return newUser;
  }

  async createWithGoogle(email: string, name: string) {
    const newUser = await this.usersRepo.create({
      email,
      name,
      isRegisteredWithGoogle: true,
    });
    await this.usersRepo.save(newUser);
    return newUser;
  }
}
