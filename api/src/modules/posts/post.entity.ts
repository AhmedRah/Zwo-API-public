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
import { GetBase64Image } from '../../utils/media';
import * as process from 'process';

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

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  postImage: string;

  @BelongsTo(() => User)
  user: User;

  @BelongsToMany(() => User, () => Like)
  likes: User[];

  @BelongsToMany(() => User, () => Share)
  shares: User[];

  get details() {
    return {
      id: this.id,
      content: this.content,
      postImage: GetBase64Image(this.postImage, process.env.UPLOAD_PATH_POSTS),
    };
  }
}
