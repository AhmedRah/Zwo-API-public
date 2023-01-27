import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  AfterFind,
} from 'sequelize-typescript';
import { User } from '../users/user.entity';
import { AnimalBreed } from '../animal-breeds/animal-breeds.entity';
import { ANIMAL_TABLE } from '../../core/constants';

@Table({ tableName: ANIMAL_TABLE })
export class Animal extends Model<Animal> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
    validate: {
      len: [3, 50],
    },
  })
  name: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    validate: {
      len: [0, 250],
    },
  })
  description: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    validate: {
      isDate: true,
    },
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
  breedId: number;

  @BelongsTo(() => AnimalBreed)
  breed: AnimalBreed;
}
