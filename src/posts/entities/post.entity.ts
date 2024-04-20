import { Entity, Column, ManyToOne } from 'typeorm';

import { AbstractEntity } from '../../common/base.entity';
import type { User } from '../../users/entities/user.entity';

@Entity()
export class Post extends AbstractEntity {
  @Column('text')
  content: string;

  @ManyToOne('User', 'posts')
  user: User;
}
