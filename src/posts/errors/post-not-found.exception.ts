import { NotFoundException } from '@/common/errors';

export class PostNotFoundException extends NotFoundException {
  constructor() {
    super('PostId가 존재하지 않습니다', 'postId');
  }
}
