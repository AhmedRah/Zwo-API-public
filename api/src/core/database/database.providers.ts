import { Sequelize } from 'sequelize-typescript';
import { User } from '../../modules/users/user.entity';
import { DEVELOPMENT, PRODUCTION, SEQUELIZE, TEST } from '../constants';
import { databaseConfig } from './database.config';
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
      sequelize.addModels([User, Post, Like, Share]);
      await sequelize.sync();
      return sequelize;
    },
  },
];
