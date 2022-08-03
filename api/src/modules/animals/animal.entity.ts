import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
} from 'sequelize-typescript';
import { User } from '../users/user.entity';
import { AnimalBreed } from '../animal-breeds/animal-breeds.entity';

@Table
export class Animal extends Model<Animal> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  birthday: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  avatar: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  owner: number;

  @ForeignKey(() => AnimalBreed)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  breed: number;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  created_at: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  updated_at: string;
}
