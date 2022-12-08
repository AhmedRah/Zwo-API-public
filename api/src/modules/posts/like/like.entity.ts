import { Table, Column, Model, ForeignKey } from 'sequelize-typescript';
import { User } from '../../users/user.entity';
import { Post } from '../post.entity';

@Table
export class Like extends Model<Like> {
  @ForeignKey(() => Post)
  @Column
  post: number;

  @ForeignKey(() => User)
  @Column
  author: number;
}
