import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { User } from '../users/user.entity';
import { AnimalBreed } from '../animal-breeds/animal-breeds.entity';
import { ANIMAL_TABLE } from '../../core/constants';
import { GetBase64Image } from '../../utils/media';

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
    validate: {
      len: [0, 250],
    },
  })
  description: string;

  @Column({
    type: DataType.DATE,
    validate: {
      isDate: true,
    },
  })
  birthday: string;

  @Column({
    type: DataType.INTEGER,
    validate: {
      min: 0,
      max: 999,
    },
  })
  weight: number;

  @Column({
    type: DataType.STRING,
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
  })
  breedId: number;

  @BelongsTo(() => AnimalBreed)
  breed: AnimalBreed;

  get minProfile() {
    return {
      id: this.id,
      name: this.name,
      birthday: this.birthday,
      avatar: this.avatar64,
    };
  }

  get profile() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      birthday: this.birthday,
      age: this.age,
      weight: this.weight,
      avatar: this.avatar64,
      breed: this.breed?.breedDetail,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  private get avatar64() {
    return !this.avatar
      ? null
      : GetBase64Image(this.avatar, process.env.UPLOAD_PATH_ANIMALS);
  }

  private get age() {
    const birthday = new Date(this.birthday);
    const today = new Date();
    let age = today.getFullYear() - birthday.getFullYear();
    const m = today.getMonth() - birthday.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthday.getDate())) {
      age--;
    }
    return age;
  }
}
