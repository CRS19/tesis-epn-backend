import { rolesEnum } from './../auth/Enums/RolesEnum';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getModelToken } from '@nestjs/mongoose';
import { CreateUserRequestDTO } from './dto/createUserRequest.dto';
import { find } from 'rxjs';

describe('UsersService', () => {
  let service: UsersService;
  let findMock = jest.fn();
  let findOneMock = jest.fn();
  let findOneAndUpdateMock = jest.fn();
  let deleteOneMock = jest.fn();
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

  beforeEach(async () => {
    class eventModel {
      constructor(private data) {}
      save = jest.fn().mockResolvedValue(this.data);
      static find = findMock;
      static findOne = findOneMock;
      static findOneAndUpdate = findOneAndUpdateMock;
      static deleteOne = deleteOneMock;
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

  const filterUser = (mail) =>
    usersArrayStored.filter((user) => user.mail === mail);

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('when create user is called, then should return a new user created', () => {
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

    expect(resposne).resolves.toEqual(usersArrayStored);
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
    findOneAndUpdateMock;

    const response = service.vinculateDevice(mail, idDevice);

    await expect(response).resolves.toEqual(true);
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
});
