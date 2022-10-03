import { Column, ForeignKey, Model, Table } from 'sequelize-typescript';
import { User } from '../../users/user.entity';
import { Post } from '../post.entity';

@Table
export class Share extends Model<Share> {
  @ForeignKey(() => Post)
  @Column
  post: number;

  @ForeignKey(() => User)
  @Column
  author: number;
}
