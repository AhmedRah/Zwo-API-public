import {
  Table,
  Column,
  Model,
  DataType,
  BelongsToMany,
} from 'sequelize-typescript';
import { USER_TABLE } from '../../core/constants';
import { Post } from '../posts/post.entity';
import { Like } from '../posts/like/like.entity';
import { Share } from '../posts/share/share.entity';

@Table({ tableName: USER_TABLE })
export class User extends Model<User> {
  @Column({
    type: DataType.STRING,
    unique: true,
    validate: {
      min: 3,
      max: 20,
      regex: /^[a-zA-Z0-9_]*$/,
    },
    allowNull: false,
  })
  username: string;

  @Column({
    type: DataType.STRING,
    validate: {
      min: 3,
      max: 25,
    },
    allowNull: false,
  })
  displayName: string;

  @Column({
    type: DataType.STRING,
    validate: {
      max: 255,
    },
  })
  bio: string;

  @Column({
    type: DataType.STRING,
    unique: true,
    validate: {
      isEmail: true,
    },
    allowNull: false,
  })
  email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password: string;

  @Column({
    type: DataType.ENUM,
    values: ['male', 'female', 'other'],
    allowNull: false,
  })
  gender: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  birthday: Date;

  @Column({
    type: DataType.ENUM,
    values: ['FR'],
    allowNull: false,
  })
  language: string;

  @Column({
    type: DataType.ENUM,
    values: ['FRA'],
    allowNull: false,
  })
  country: string;

  @BelongsToMany(() => Post, () => Like)
  likes: Post[];

  @BelongsToMany(() => Post, () => Share)
  shares: Post[];
}
