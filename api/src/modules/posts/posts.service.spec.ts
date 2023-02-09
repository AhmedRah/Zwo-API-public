import { Test, TestingModule } from '@nestjs/testing';
import { PostsService } from './posts.service';
import { postsProviders } from './posts.providers';

describe('PostsService', () => {
  let service: PostsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PostsService, ...postsProviders],
    }).compile();

    service = module.get<PostsService>(PostsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
