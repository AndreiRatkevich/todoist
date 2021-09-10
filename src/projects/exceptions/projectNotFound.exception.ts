import { NotFoundException } from '@nestjs/common';

export class ProjectNotFoundException extends NotFoundException {
  constructor(postId: number) {
    super(`Project with id ${postId} not found`);
  }
}
