import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtConfigService } from './jwt-config.service';

describe('JwtConfigService', () => {
  let service: JwtConfigService;
  let getMock = jest.fn();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtConfigService,
        {
          provide: ConfigService,
          useValue: {
            get: getMock,
          },
        },
      ],
    }).compile();

    service = module.get<JwtConfigService>(JwtConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('When createJwtOptions is called, then get from configService should be called', async () => {
    getMock.mockReturnValue('ELPEPESECRET');
    const response = service.createJwtOptions();

    await expect(response)
      .resolves.toEqual({
        secret: 'ELPEPESECRET',
        signOptions: { expiresIn: '24h' },
      })
      .catch((err) => console.log(err));

    expect(getMock).toHaveBeenCalledWith('JWT_SECRET');
  });
});
