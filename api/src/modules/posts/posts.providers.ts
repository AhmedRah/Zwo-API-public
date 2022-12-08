import { Post } from './post.entity';

export const postsProviders = [
  {
    provide: 'POST_REPOSITORY',
    useValue: Post,
  },
];
