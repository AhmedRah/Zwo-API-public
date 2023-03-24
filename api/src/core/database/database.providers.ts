import { Sequelize } from 'sequelize-typescript';
import { DEVELOPMENT, PRODUCTION, SEQUELIZE, TEST } from '../constants';
import { databaseConfig } from './database.config';
import { User } from '../../modules/users/user.entity';
import { Animal } from '../../modules/animals/animal.entity';
import { AnimalBreed } from '../../modules/animal-breeds/animal-breeds.entity';
import { Post } from '../../modules/posts/post.entity';
import { Like } from '../../modules/posts/like/like.entity';
import { Share } from '../../modules/posts/share/share.entity';

export const databaseProviders = [
  {
    provide: SEQUELIZE,
    useFactory: async () => {
      let config;
      switch (process.env.NODE_ENV) {
        case DEVELOPMENT:
          config = databaseConfig.development;
          break;
        case TEST:
          config = databaseConfig.test;
          break;
        case PRODUCTION:
          config = databaseConfig.production;
          break;
        default:
          config = databaseConfig.development;
      }

      const sequelize = new Sequelize(config);
      sequelize.addModels([User, Animal, AnimalBreed, Post, Like, Share]);
      await sequelize.sync({
        force: process.env.SEQUELIZE_SYNC_ALTER === 'true',
      });
      return sequelize;
    },
  },
];
