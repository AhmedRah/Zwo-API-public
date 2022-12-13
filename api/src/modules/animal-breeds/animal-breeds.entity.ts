import { Table, Column, Model, DataType } from 'sequelize-typescript';
import { ANIMALBREED_TABLE } from '../../core/constants';

@Table({ tableName: ANIMALBREED_TABLE })
export class AnimalBreed extends Model<AnimalBreed> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  type: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  breed: string;
}
