import { rolesEnum } from './../auth/Enums/RolesEnum';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getModelToken } from '@nestjs/mongoose';
import { CreateUserRequestDTO } from './dto/createUserRequest.dto';
import { find } from 'rxjs';
import { IUsersDB } from './interfaces/users.interfaces';

describe('UsersService', () => {
  let service: UsersService;
  let findMock = jest.fn();
  let findOneMock = jest.fn();
  let findOneAndUpdateMock = jest.fn();
  let deleteOneMock = jest.fn();
  let existsMock = jest.fn();
  let testUserFound = {
    fullName: 'CRS test',
    mail: 'testMail',
    password: 'secret',
    idDevice: '',
    isDevice: false,
    isSick: false,
    isPossibleSick: false,
    rol: rolesEnum.USER,
  };
  let usersArrayStored = [testUserFound];
  let mail;
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
  let userAsNodesResponseExpected = {
    colour: '#79ff00',
    id: '1234',
    mail: 'crs@gmail.com',
    name: 'crs test',
  };
  const userRequest: CreateUserRequestDTO = {
    fullName: 'CRS test',
    mail: 'a@a.com',
    password: 'secret',
    idDevice: '',
    isDevice: false,
    isSick: false,
    isPossibleSick: false,
    rol: rolesEnum.USER,
  };

  beforeEach(async () => {
    class eventModel {
      constructor(private data) {}
      save = jest.fn().mockResolvedValue(this.data);
      static find = findMock;
      static findOne = findOneMock;
      static findOneAndUpdate = findOneAndUpdateMock;
      static deleteOne = deleteOneMock;
      static exists = existsMock;
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken('users'),
          useValue: eventModel,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const findUser = (mail) =>
    usersArrayStored.find((user) => user.mail === mail);

  const findUserByIdDevice = (idDevice) =>
    [mockCreateUserServiceResponse].find((user) => user.idDevice === idDevice);

  const filterUser = (mail) =>
    usersArrayStored.filter((user) => user.mail === mail);

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('when create user is called, then should return a new user created', () => {
    expect(service.createNewUser(userRequest))
      .resolves.toEqual(userRequest)
      .catch((err) => {
        console.log(err);
      });
  });

  it('When findUser is called with an exist mail, then should return an array of users', async () => {
    mail = 'testMail';
    findOneMock.mockResolvedValue(findUser(mail));

    const resposne = service.findUser(mail);

    expect(resposne).resolves.toEqual(usersArrayStored[0]);
    expect(findOneMock).toHaveBeenCalledWith({ mail });
  });

  it('When findUser is called with non exist user, then should return an undefined', async () => {
    mail = 'elpepe';
    findOneMock.mockResolvedValue(findUser(mail));

    const resposne = service.findUser(mail);

    expect(resposne).resolves.toEqual(undefined);
    expect(findOneMock).toHaveBeenCalledWith({ mail });
  });

  it('When vinculateDevice is called with exist user, then should return true and findOneAndUpdate should be called once', async () => {
    const idDevice = 'abc';

    mail = 'testMail';
    findOneMock.mockResolvedValue(find(mail));
    findOneAndUpdateMock.mockResolvedValue({ ...find(mail), idDevice });

    const response = service.vinculateDevice(mail, idDevice);

    await expect(response).resolves.toEqual({
      _doc: { password: undefined },
      idDevice: 'abc',
    });
    expect(findOneMock).toHaveBeenCalledTimes(1);
    expect(findOneAndUpdateMock).toHaveBeenCalledTimes(1);
  });

  it('When vinculateDevice is called with no exist user, then should return false and findOneAndUpdate should not be called', async () => {
    const idDevice = 'abc';

    mail = 'testMail';
    findOneMock.mockResolvedValue(undefined);
    findOneAndUpdateMock;

    const response = service.vinculateDevice(mail, idDevice);

    await expect(response).resolves.toEqual(false);
    expect(findOneMock).toHaveBeenCalledTimes(1);
    expect(findOneAndUpdateMock).toHaveBeenCalledTimes(0);
  });

  it('When create user is called with an exist user, then it should return an undefined', async () => {
    existsMock.mockReturnValue(mockCreateUserServiceResponse);

    const response = await service.createNewUser(userRequest);

    expect(response).toEqual(undefined);
  });

  it('When create user is called with a non exist user, then it should return an user', async () => {
    existsMock.mockReturnValue(undefined);

    const response = await service.createNewUser(userRequest);

    expect({ ...response, password: 'secret' }).toEqual(userRequest);
  });

  it('When getUsersAsNodes is called, then it should return an user as node', async () => {
    const idDevice = '1234';
    findOneMock.mockResolvedValue(findUserByIdDevice(idDevice));

    const response = await service.getUsersAsNodes(idDevice);

    expect(response).toEqual(userAsNodesResponseExpected);
  });

  it('When getUsersAsNodes is called, with name Maria Perez, it should create color #ff3b00 ', async () => {
    const idDevice = '1234';
    findOneMock.mockResolvedValue({
      ...findUserByIdDevice(idDevice),
      fullName: 'Maria Perez',
    });

    const response = await service.getUsersAsNodes(idDevice);

    expect(response).toEqual({
      ...userAsNodesResponseExpected,
      name: 'Maria Perez',
      colour: '#ff3b00',
    });
  });

  it('When getUsersAsNodes is called, with name Angel Zapata, it should create color #00ff4e ', async () => {
    const idDevice = '1234';
    findOneMock.mockResolvedValue({
      ...findUserByIdDevice(idDevice),
      fullName: 'Angel Zapata',
    });

    const response = await service.getUsersAsNodes(idDevice);

    expect(response).toEqual({
      ...userAsNodesResponseExpected,
      name: 'Angel Zapata',
      colour: '#00ff4e',
    });
  });

  it('When getUsersAsNodes is called, with name Erik Zapata, it should create color #2cff00 ', async () => {
    const idDevice = '1234';
    findOneMock.mockResolvedValue({
      ...findUserByIdDevice(idDevice),
      fullName: 'Erik Zapata',
    });

    const response = await service.getUsersAsNodes(idDevice);

    expect(response).toEqual({
      ...userAsNodesResponseExpected,
      name: 'Erik Zapata',
      colour: '#2cff00',
    });
  });

  it('When getUsersAsNodes is called, with name Wilmar Cristobal Santos, it should create color #ff0046 ', async () => {
    const idDevice = '1234';
    findOneMock.mockResolvedValue({
      ...findUserByIdDevice(idDevice),
      fullName: 'Wilmar Cristobal Santos',
    });

    const response = await service.getUsersAsNodes(idDevice);

    expect(response).toEqual({
      ...userAsNodesResponseExpected,
      name: 'Wilmar Cristobal Santos',
      colour: '#ff0046',
    });
  });

  it('When getUsersAsNodes is called, with name Shakira Baracuda, it should create color #c400ff ', async () => {
    const idDevice = '1234';
    findOneMock.mockResolvedValue({
      ...findUserByIdDevice(idDevice),
      fullName: 'Shakira Baracuda',
    });

    const response = await service.getUsersAsNodes(idDevice);

    expect(response).toEqual({
      ...userAsNodesResponseExpected,
      name: 'Shakira Baracuda',
      colour: '#c400ff',
    });
  });

  it('When getUsersAsNodes is called, with name } a, it should create color #00e0ff ', async () => {
    const idDevice = '1234';
    findOneMock.mockResolvedValue({
      ...findUserByIdDevice(idDevice),
      fullName: `${String.fromCharCode(125)} a`,
    });

    const response = await service.getUsersAsNodes(idDevice);

    expect(response).toEqual({
      ...userAsNodesResponseExpected,
      name: '} a',
      colour: '#00e0ff',
    });
  });

  it('When getUsersAsNodes is called, with no name, it should create color #ff0000 ', async () => {
    const idDevice = '1234';
    findOneMock.mockResolvedValue({
      ...findUserByIdDevice(idDevice),
      fullName: undefined,
    });

    const response = await service.getUsersAsNodes(idDevice);

    expect(response).toEqual({
      ...userAsNodesResponseExpected,
      name: undefined,
      colour: '#ff0000',
    });
  });
});
