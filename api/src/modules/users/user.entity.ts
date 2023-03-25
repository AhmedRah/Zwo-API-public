import {
  Table,
  Column,
  Model,
  DataType,
  BelongsToMany,
  HasMany,
} from 'sequelize-typescript';
import { USER_TABLE } from '../../core/constants';
import { Post } from '../posts/post.entity';
import { Like } from '../posts/like/like.entity';
import { Share } from '../posts/share/share.entity';
import { ApiHideProperty } from '@nestjs/swagger';
import { Follower } from './followers/follower.entity';
import { Animal } from '../animals/animal.entity';

@Table({ tableName: USER_TABLE })
export class User extends Model<User> {
  @Column({
    type: DataType.STRING,
    unique: true,
    validate: {
      len: [3, 20],
      regex: /^[a-zA-Z0-9_]*$/,
    },
    allowNull: false,
  })
  username: string;

  @Column({
    type: DataType.STRING,
    validate: {
      len: [3, 25],
    },
    allowNull: false,
  })
  displayName: string;

  @Column({
    type: DataType.STRING,
    validate: {
      len: [0, 255],
    },
  })
  bio: string;

  @Column({
    type: DataType.STRING,
    unique: true,
    validate: {
      len: [0, 255],
      isEmail: true,
    },
    allowNull: false,
  })
  email: string;

  @ApiHideProperty()
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

  @ApiHideProperty()
  @HasMany(() => Follower, 'followerId')
  followers: User[];

  @ApiHideProperty()
  @HasMany(() => Follower, 'followingId')
  following: User[];

  @ApiHideProperty()
  @HasMany(() => Animal, 'owner')
  animals: Animal[];

  @ApiHideProperty()
  @BelongsToMany(() => Post, () => Like)
  likes: Post[];

  @ApiHideProperty()
  @BelongsToMany(() => Post, () => Share)
  shares: Post[];

  get detailName() {
    return {
      id: this.id,
      username: this.username,
      displayName: this.displayName,
    };
  }

  get profile() {
    return {
      id: this.id,
      username: this.username,
      displayName: this.displayName,
      bio: this.bio,
      followers: this.followers.length,
      following: this.following.length,
      animals: this.animals?.map((animal) => animal.minProfile),
      createdAt: this.createdAt,
    };
  }
}
