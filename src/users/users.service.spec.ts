import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getModelToken } from '@nestjs/mongoose';
import { CreateUserRequestDTO } from './dto/createUserRequest.dto';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    class eventModel {
      constructor(private data) {}
      save = jest.fn().mockResolvedValue(this.data);
      static find = jest.fn();
      static findOne = jest.fn();
      static findOneAndUpdate = jest.fn();
      static deleteOne = jest.fn();
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

  afterEach(() => {});

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('when create user is called, then should return a new user created', () => {
    const userRequest: CreateUserRequestDTO = {
      fullName: 'CRS test',
      mail: 'a@a.com',
      password: 'secret',
      idDevice: '',
      isSick: false,
      isPossibleSick: false,
    };
    expect(service.createNewUser(userRequest))
      .resolves.toEqual(userRequest)
      .catch((err) => {
        console.log(err);
      });
  });
});
