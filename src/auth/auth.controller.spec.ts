import { UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RolesGuard } from './Guards/Roles.guard';
import { ILogginRequest } from './interfaces/LogginRequest';
import { JwtStrategy } from './jwt.strategy';

describe('AuthController', () => {
  let controller: AuthController;
  let validateUserMock = jest.fn();
  let canActivateMock = jest.fn();
  let validateMock = jest.fn();
  let generateAccessTokenMock = jest.fn();
  let bodyLoginMock: ILogginRequest = {
    mail: 'userMail',
    password: 'userPass',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            validateUser: validateUserMock,
            generateAccessToken: generateAccessTokenMock,
          },
        },
        {
          provide: RolesGuard,
          useValue: {
            canActivate: canActivateMock,
          },
        },
        {
          provide: JwtStrategy,
          useValue: {
            vaildate: validateMock,
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('When /login is called, then should return an access token', async () => {
    const token = { access_token: 'tokencito' };
    validateUserMock.mockReturnValue(true);
    generateAccessTokenMock.mockReturnValue(token);

    const response = await controller.login(bodyLoginMock);

    expect(validateUserMock).toHaveBeenCalledWith(
      bodyLoginMock.mail,
      bodyLoginMock.password,
    );
    expect(generateAccessTokenMock).toHaveBeenCalledWith(bodyLoginMock.mail);
    expect(response).toEqual(token);
  });

  it('When /login is called with wrong pass, then should return an unauthorized exeption ', async () => {
    const token = { access_token: 'tokencito' };
    validateUserMock.mockReturnValue(false);

    await expect(controller.login(bodyLoginMock)).rejects.toThrow(
      new UnauthorizedException(),
    );
    expect(validateUserMock).toHaveBeenCalledWith(
      bodyLoginMock.mail,
      bodyLoginMock.password,
    );
    expect(generateAccessTokenMock).not.toHaveBeenCalled();
  });

  it('When /login is called with wrong pass, then should be alive', async () => {
    await controller.protectedEnpoint();

    expect(true);
  });
});
