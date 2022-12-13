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
    allowNull: false,
  })
  username: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  firstname: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  lastname: string;

  @Column({
    type: DataType.STRING,
    unique: true,
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
    // add whatever flavour of gender you want , could be remvoved entirely if it get's too  comp
    values: ['male', 'female', 'other'],
    allowNull: true,
  })
  gender: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  birthday: Date;

  @Column({
    type: DataType.ENUM,
    // add more supported languages as the app gets more main stream
    values: ['EN', 'FR', 'AR'],
    allowNull: true,
  })
  language: string;

  @Column({
    type: DataType.ENUM,
    // add more supported languages as the app gets more main stream
    values: ['USA', 'FRA'],
    allowNull: true,
  })
  country: string;

  @BelongsToMany(() => Post, () => Like)
  likes: Post[];

  @BelongsToMany(() => Post, () => Share)
  shares: Post[];
}
