import { Like } from './like.entity';

export const likesProviders = [
  {
    provide: 'LIKE_REPOSITORY',
    useValue: Like,
  },
];
