import { Table, Column, Model, DataType, ForeignKey } from 'sequelize-typescript';

@Table
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