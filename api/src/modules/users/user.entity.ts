import { Timestamp } from 'rxjs';
import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table
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
        values: ['male', 'female', "other"],
        allowNull: true,
    })
    gender: string;
    
    @Column({
        type: DataType.DATE,
        allowNull: true,
    })
    birthday: Date

    @Column({
        type: DataType.ENUM,
        // add more supported languages as the app gets more main stream 
        values: ['EN', 'FR', "AR"],
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
}