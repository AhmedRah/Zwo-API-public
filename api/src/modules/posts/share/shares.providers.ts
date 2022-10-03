import { Share } from './share.entity';

export const sharesProviders = [
  {
    provide: 'SHARE_REPOSITORY',
    useValue: Share,
  },
];
