import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserRequestDTO } from './dto/createUserRequest.dto';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { unset } from 'lodash';
import { vinculateDeviceRequest } from './dto/vinculateDeviceRequest.dto';

describe('UsersController', () => {
  let controller: UsersController;
  let createNewUserMock = jest.fn();
  let findUserMock = jest.fn();
  let vinculateDeviceMock = jest.fn();
  let responseJsonMock = {
    json: jest.fn((x) => x),
  };
  let responseMock = {
    status: jest.fn((x) => responseJsonMock),
    send: jest.fn((x) => x),
  };

  let bodyMock: CreateUserRequestDTO = {
    fullName: 'Elpepe',
    mail: 'elpepe@test.com',
    password: 'abc',
    rol: 'user',
    idDevice: '',
    isSick: false,
    isPossibleSick: false,
    isDevice: false,
  };
  let vinculateDeviceBodyMock: vinculateDeviceRequest = {
    idDevice: 'abc',
    mail: 'kristian192019d@gmail.com',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            createNewUser: createNewUserMock,
            findUser: findUserMock,
            vinculateDevice: vinculateDeviceMock,
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('When /Register is called whit a correct user, then createNewUser should return 201', async () => {
    await controller.createNewUser(responseMock, bodyMock);

    expect(createNewUserMock).toHaveBeenCalledWith(bodyMock);
    expect(responseMock.status).toHaveBeenCalledWith(201);
    expect(responseJsonMock.json).toHaveBeenCalledWith({ message: 'ok' });
  });

  it('When /Register is called whit a incorrect correct user, then createNewUser should return 304', async () => {
    let incorrectBody = bodyMock;
    unset(incorrectBody, 'fullName');
    createNewUserMock.mockRejectedValue(undefined);

    await controller.createNewUser(responseMock, incorrectBody);

    expect(createNewUserMock).toHaveBeenCalledWith(bodyMock);
    expect(responseMock.status).toHaveBeenCalledWith(304);
    expect(responseJsonMock.json).toHaveBeenCalledWith({
      message: 'Error while create user',
    });
  });

  it('When /vinculateDevice is called, then vinculateDevice should be called', async () => {
    vinculateDeviceMock.mockReturnValue(true);
    await controller.vinculateDevice(responseMock, vinculateDeviceBodyMock);

    expect(vinculateDeviceMock).toHaveBeenCalledWith(
      vinculateDeviceBodyMock.mail,
      vinculateDeviceBodyMock.idDevice,
    );
    expect(responseMock.status).toHaveBeenCalledWith(200);
    expect(responseJsonMock.json).toHaveBeenCalledWith({ message: 'ok' });
  });

  it('When /vinculateDevice is called and with non exist idDevice or mailUser, then vinculateDevice should be called and httpStatus code should be 304', async () => {
    vinculateDeviceMock.mockReturnValue(undefined);
    await controller.vinculateDevice(responseMock, vinculateDeviceBodyMock);

    expect(vinculateDeviceMock).toHaveBeenCalledWith(
      vinculateDeviceBodyMock.mail,
      vinculateDeviceBodyMock.idDevice,
    );
    expect(responseMock.status).toHaveBeenCalledWith(304);
    expect(responseJsonMock.json).toHaveBeenCalledWith({
      message: 'mail Incorrect',
    });
  });

  it('When /vinculateDevice is called and vinculateDeviceService fails, then vinculateDevice should be called and httpStatus code should be 304', async () => {
    vinculateDeviceMock.mockRejectedValue(undefined);
    await controller.vinculateDevice(responseMock, vinculateDeviceBodyMock);

    expect(vinculateDeviceMock).toHaveBeenCalledWith(
      vinculateDeviceBodyMock.mail,
      vinculateDeviceBodyMock.idDevice,
    );
    expect(responseMock.status).toHaveBeenCalledWith(304);
    expect(responseJsonMock.json).toHaveBeenCalledWith({
      message: 'Error while create user',
    });
  });
});
