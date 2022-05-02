import { Test, TestingModule } from '@nestjs/testing';
import { MongodbConfigService } from './mongodb-config.service';

describe('MongodbConfigService', () => {
  let service: MongodbConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MongodbConfigService],
    }).compile();

    service = module.get<MongodbConfigService>(MongodbConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
