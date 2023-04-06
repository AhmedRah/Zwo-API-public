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

@Table
export class Post extends Model<Post> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @ForeignKey(() => Post)
  @Column
  parentId: number;

  @Column({
    type: DataType.STRING,
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

  @BelongsTo(() => Post, { onDelete: 'CASCADE' })
  parent: Post;

  @BelongsToMany(() => Post, () => Post, 'parentId', 'id')
  children: Post[];

  @BelongsTo(() => User)
  user: User;

  @BelongsToMany(() => User, () => Like)
  likes: User[];

  @BelongsToMany(() => User, () => Share)
  shares: User[];

  get details() {
    return {
      id: this.id,
      parentId: this.parentId,
      content: this.content,
      postImage: this.postImage
        ? GetBase64Image(this.postImage, process.env.UPLOAD_PATH_POSTS)
        : null,
      children: this.children?.length || 0,
      createdAt: this.createdAt,
    };
  }
}
