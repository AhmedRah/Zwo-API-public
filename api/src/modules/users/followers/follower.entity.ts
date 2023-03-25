import { Column, ForeignKey, Model, Table } from 'sequelize-typescript';
import { USER_FOLLOWER_TABLE } from '../../../core/constants';
import { User } from '../user.entity';

@Table({ tableName: USER_FOLLOWER_TABLE })
export class Follower extends Model<Follower> {
  @ForeignKey(() => User)
  @Column
  followerId: number;

  @ForeignKey(() => User)
  @Column
  followingId: number;
}
