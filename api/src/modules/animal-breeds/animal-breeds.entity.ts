import { Table, Column, Model, DataType } from 'sequelize-typescript';
import { ANIMALBREED_TABLE } from '../../core/constants';

@Table({ tableName: ANIMALBREED_TABLE, timestamps: false })
export class AnimalBreed extends Model<AnimalBreed> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  type: string;

  @Column({
    type: DataType.STRING,
  })
  breed: string;

  @Column({
    type: DataType.STRING,
  })
  emoji: string;

  @Column({
    type: DataType.STRING,
  })
  translation: string;

  @Column({
    type: DataType.INTEGER,
  })
  order: number;

  get typeDetail() {
    return {
      id: this.id,
      type: this.type,
      emoji: this.emoji,
      translation: {
        fr: this.translation,
      },
    };
  }

  get breedDetail() {
    return {
      id: this.id,
      type: this.type,
      breed: this.breed,
      translation: {
        fr: this.translation,
      },
    };
  }
}
