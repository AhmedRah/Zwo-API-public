import { POST_REPOSITORY, USER_REPOSITORY } from '../../core/constants';
import { Post } from './post.entity';
import { User } from '../users/user.entity';

export const postsProviders = [
  {
    provide: POST_REPOSITORY,
    useValue: Post,
  },
  {
    provide: USER_REPOSITORY,
    useValue: User,
  },
];
