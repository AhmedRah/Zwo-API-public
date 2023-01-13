import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  BelongsToMany,
} from 'sequelize-typescript';
import { User } from '../users/user.entity';
import { Like } from './like/like.entity';
import { Share } from './share/share.entity';

@Table
export class Post extends Model<Post> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
    validate: {
      len: [0, 1000],
    },
  })
  content: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  author: number;

  @BelongsTo(() => User)
  user: User;

  @BelongsToMany(() => User, () => Like)
  likes: User[];

  @BelongsToMany(() => User, () => Share)
  shares: User[];
}
