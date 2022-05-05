import { JwtService } from '@nestjs/jwt';
import { UsersService } from './../users/users.service';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let createNewUserMock = jest.fn();
  let findUserMock = jest.fn();
  let signMock = jest.fn();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            createNewUser: createNewUserMock,
            findUser: findUserMock,
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: signMock,
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('When validateUser is called, then findUser should be called', async () => {
    const userName = 'elpepeuser';
    const pass = 'elpepepass';

    findUserMock.mockReturnValue({
      password: '$2a$12$zh5PRh7U9VT7RgNDBBKyAOnBexfb49OS.04LhGiXBwmC7FUKiyiUG',
    });

    const response = service.validateUser(userName, pass);

    await expect(response)
      .resolves.toEqual(true)
      .catch((err) => console.log(err));

    expect(findUserMock).toHaveBeenCalled();
  });

  it('When generateAccessToken is called, then findUser should be called', async () => {
    const userName = 'elpepeuser';
    const accessToken = 'tokengen';
    const user = {
      mail: 'elpepeuser',
      password: '$2a$12$zh5PRh7U9VT7RgNDBBKyAOnBexfb49OS.04LhGiXBwmC7FUKiyiUG',
    };

    findUserMock.mockReturnValue(user);

    signMock.mockReturnValue(accessToken);

    const response = service.generateAccessToken(userName);

    await expect(response)
      .resolves.toEqual({ access_token: accessToken, user })
      .catch((err) => console.log(err));

    expect(findUserMock).toHaveBeenCalled();
  });
});
