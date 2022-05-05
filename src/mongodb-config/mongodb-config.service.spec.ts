import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { MongodbConfigService } from './mongodb-config.service';

describe('MongodbConfigService', () => {
  let service: MongodbConfigService;
  let getMock = jest.fn();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MongodbConfigService,

        {
          provide: ConfigService,
          useValue: {
            get: getMock,
          },
        },
      ],
    }).compile();

    service = module.get<MongodbConfigService>(MongodbConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('When createMongooseOptions is called, then get from confiService should be called', async () => {
    getMock
      .mockReturnValueOnce('db_secret_pass')
      .mockReturnValueOnce('db_user')
      .mockReturnValueOnce('auth_source')
      .mockReturnValueOnce('mongo_uri');

    const response = service.createMongooseOptions();

    await expect(response)
      .resolves.toEqual({
        uri: 'mongo_uri',
        useNewUrlParser: true,
        authSource: 'auth_source',
        user: 'db_user',
        pass: 'db_secret_pass',
      })
      .catch((err) => console.log(err));
    expect(getMock).toHaveBeenCalledTimes(4);
  });
});
