import { rolesEnum } from './../auth/Enums/RolesEnum';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserRequestDTO } from './dto/createUserRequest.dto';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { unset } from 'lodash';
import { vinculateDeviceRequest } from './dto/vinculateDeviceRequest.dto';
import { USER_TEST_RESPONSE_MOCK } from './constants/TestConstants';

describe('UsersController', () => {
  let controller: UsersController;
  let createNewUserMock = jest.fn();
  let findUserMock = jest.fn();
  let vinculateDeviceMock = jest.fn();
  let updateIsSickMock = jest.fn();
  let getUserByMailMock = jest.fn();
  let responseJsonMock = {
    json: jest.fn((x) => x),
  };
  let responseMock = {
    status: jest.fn((x) => responseJsonMock),
    send: jest.fn((x) => x),
  };
  let mockCreateUserServiceResponse = {
    fullName: 'crs test',
    idDevice: '1234',
    isDevice: false,
    isPossibleSick: false,
    isSick: false,
    mail: 'crs@gmail.com',
    password: 'dsfasdf',
    rol: rolesEnum.USER,
  };

  let bodyMock: CreateUserRequestDTO = {
    fullName: 'Elpepe',
    mail: 'elpepe@test.com',
    password: 'abc',
    rol: 'user',
    idDevice: '',
    isSick: false,
    isPossibleSick: false,
    isPossibleSickTs: 0,
    isDevice: false,
    nearNodes: [],
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
            updateIsSick: updateIsSickMock,
            getUserByMail: getUserByMailMock,
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('When /Register is called with a correct user, then createNewUser should return 201', async () => {
    createNewUserMock.mockReturnValue(mockCreateUserServiceResponse);

    await controller.createNewUser(responseMock, bodyMock);

    expect(createNewUserMock).toHaveBeenCalledWith(bodyMock);
    expect(responseMock.status).toHaveBeenCalledWith(201);
    expect(responseJsonMock.json).toHaveBeenCalledWith({ message: 'ok' });
  });

  it('When /Register is called with a correct user but service return an undefined user, then createNewUser should return 406', async () => {
    createNewUserMock.mockReturnValue(undefined);

    await controller.createNewUser(responseMock, bodyMock);

    expect(createNewUserMock).toHaveBeenCalledWith(bodyMock);
    expect(responseMock.status).toHaveBeenCalledWith(406);
    expect(responseJsonMock.json).toHaveBeenCalledWith({
      message: 'User Already Exists',
    });
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
    vinculateDeviceMock.mockReturnValue(USER_TEST_RESPONSE_MOCK);
    await controller.vinculateDevice(responseMock, vinculateDeviceBodyMock);

    expect(vinculateDeviceMock).toHaveBeenCalledWith(
      vinculateDeviceBodyMock.mail,
      vinculateDeviceBodyMock.idDevice,
    );
    expect(responseMock.status).toHaveBeenCalledWith(200);
    expect(responseJsonMock.json).toHaveBeenCalledWith({
      message: 'ok',
      updatedResposne: USER_TEST_RESPONSE_MOCK,
    });
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

  it('When /updateSick is called, then updateIsSick method should be called', async () => {
    updateIsSickMock.mockResolvedValue(mockCreateUserServiceResponse);
    await controller.updateIsSick(responseMock, {
      mail: 'mail',
      isSick: true,
    });

    expect(updateIsSickMock).toHaveBeenCalledWith('mail', true);
    expect(responseMock.status).toHaveBeenCalledWith(200);
    expect(responseJsonMock.json).toHaveBeenCalledWith({
      message: 'ok',
      updatedResposne: mockCreateUserServiceResponse,
    });
  });

  it('When /updateSick is called and updateIsSickService fails, then updateIsSick method should be called and httpStatus code should be 304', async () => {
    updateIsSickMock.mockRejectedValue(undefined);
    await controller.updateIsSick(responseMock, {
      mail: 'mail',
      isSick: true,
    });

    expect(updateIsSickMock).toHaveBeenCalledWith('mail', true);
    expect(responseMock.status).toHaveBeenCalledWith(304);
    expect(responseJsonMock.json).toHaveBeenCalledWith({
      message: 'Error while create user',
    });
  });

  it('When /updateSick is called and with non exist mail, then updateIsSick method should be called and httpStatus code should be 304', async () => {
    updateIsSickMock.mockResolvedValue(undefined);
    await controller.updateIsSick(responseMock, {
      mail: 'mail',
      isSick: true,
    });

    expect(updateIsSickMock).toHaveBeenCalledWith('mail', true);
    expect(responseMock.status).toHaveBeenCalledWith(304);
    expect(responseJsonMock.json).toHaveBeenCalledWith({
      message: 'mail Incorrect',
    });
  });

  it('When /:mail is called, then getUserByMail method should be called', async () => {
    getUserByMailMock.mockResolvedValue(mockCreateUserServiceResponse);
    await controller.getUserByMail(responseMock, 'mail');

    expect(getUserByMailMock).toHaveBeenCalledWith('mail');
    expect(responseMock.status).toHaveBeenCalledWith(200);
    expect(responseJsonMock.json).toHaveBeenCalledWith({
      message: 'ok',
      user: mockCreateUserServiceResponse,
    });
  });

  it('When /:mail is called and with non exist mail, then getUserByMail method should be called and httpStatus code should be 304', async () => {
    getUserByMailMock.mockResolvedValue(undefined);
    await controller.getUserByMail(responseMock, 'mail');

    expect(getUserByMailMock).toHaveBeenCalledWith('mail');
    expect(responseMock.status).toHaveBeenCalledWith(404);
    expect(responseJsonMock.json).toHaveBeenCalledWith({
      message: 'User not found',
    });
  });

  it('When /:mail is called and getUserByMailService fails, then getUserByMail method should be called and httpStatus code should be 304', async () => {
    getUserByMailMock.mockRejectedValue(undefined);
    await controller.getUserByMail(responseMock, 'mail');

    expect(getUserByMailMock).toHaveBeenCalledWith('mail');
    expect(responseMock.status).toHaveBeenCalledWith(304);
    expect(responseJsonMock.json).toHaveBeenCalledWith({
      message: 'Error while get user',
    });
  });

  it('When /vinculateDevice is called with incorrect user, then vinculateDevice should be called and httpStatus code should be 304', async () => {
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
});
