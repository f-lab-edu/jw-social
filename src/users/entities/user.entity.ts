import { Exclude } from 'class-transformer';
import { Entity, Column, Unique, OneToMany } from 'typeorm';

import { AbstractEntity } from '../../common/base.entity';
import type { Post } from '../../posts/entities/post.entity';

@Entity()
@Unique(['email'])
export class User extends AbstractEntity {
  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ nullable: true })
  avatar?: string;

  @OneToMany('Post', 'user')
  posts: Post[];
}
