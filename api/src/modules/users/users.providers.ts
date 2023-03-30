import {
  USER_FOLLOWER_REPOSITORY,
  USER_REPOSITORY,
} from '../../core/constants';
import { User } from './user.entity';
import { Follower } from './followers/follower.entity';

export const usersProviders = [
  {
    provide: USER_REPOSITORY,
    useValue: User,
  },
  {
    provide: USER_FOLLOWER_REPOSITORY,
    useValue: Follower,
  },
];
