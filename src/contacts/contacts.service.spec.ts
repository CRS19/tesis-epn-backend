import { USER_TEST_RESPONSE_MOCK } from './../users/constants/TestConstants';
import { UsersService } from './../users/users.service';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { ContactsService } from './contacts.service';
import { IContactRequest, IContacts } from './interfaces/contacts.interface';
import { set } from 'lodash';
import {
  expectedValue,
  firstCall,
  getContactsDataTableResponse,
  getContactsMockRepsonse,
  secondCall,
  twoExpected,
  userRequestSecondCall,
  userResponseFirstCall,
} from './constants/testContants';

describe('ContactsService', () => {
  let service: ContactsService;
  let createContactBody: IContactRequest = {
    idDevice: 'abc',
    idContactDevice: 'contactABC',
    rssi: 0,
    isInit: true,
  };
  let createContactInitializedResponse = {
    idDevice: 'myiddevice',
    idContactDevice: 'idContactDevice',
    rssi: -50,
    timestampInit: 1652156505205,
    timestampEnd: 0,
  };
  let findMock = jest.fn();
  let findOneMock = jest.fn();
  let findOneAndUpdateMock = jest.fn();
  let deleteOneMock = jest.fn();
  let createNewUserMock = jest.fn();
  let findUserMock = jest.fn();
  let sortMock = jest.fn();
  let getUsersAsNodesMock = jest.fn();
  let sort2 = jest.fn();
  let updateNearNodeMock = jest.fn();
  let countDocumentsMock = jest.fn();
  let findUserByIdDeviceMock = jest.fn();

  beforeEach(async () => {
    class eventModel {
      constructor(private data) {}
      save = jest.fn().mockResolvedValue(this.data);
      static find = findMock;
      static sort = sortMock;
      static findOne = findOneMock;
      static findOneAndUpdate = findOneAndUpdateMock;
      static deleteOne = deleteOneMock;
      static countDocuments = countDocumentsMock;
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContactsService,
        {
          provide: UsersService,
          useValue: {
            createNewUser: createNewUserMock,
            findUser: findUserMock,
            findUserByIdDevice: findUserByIdDeviceMock,
            getUsersAsNodes: getUsersAsNodesMock,
            updateNearNode: updateNearNodeMock,
          },
        },
        {
          provide: getModelToken('contacts'),
          useValue: eventModel,
        },
      ],
    }).compile();

    service = module.get<ContactsService>(ContactsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('When createContact is called and is InitContact, then contactsModel should create new contact record', () => {
    const idDevice = 'abc';

    findOneMock.mockReturnValue(undefined);

    const response = service.createContact(createContactBody);

    expect(response)
      .resolves.toEqual(
        expect.objectContaining<Partial<IContacts>>({
          timestampEnd: 0,
          idDevice: 'abc',
        }),
      )
      .catch((err) => console.log(err));

    expect(response)
      .resolves.toHaveProperty('timestampInit')
      .catch((err) => console.log(err));
  });

  it('When createContact is called and is EndContact, then contactsModel should update previous contact record created', () => {
    set(createContactBody, 'isInit', false);
    findOneMock.mockReturnValue(createContactInitializedResponse);

    const response = service.createContact(createContactBody);

    expect(response)
      .resolves.toEqual(
        expect.objectContaining<Partial<IContacts>>({
          idDevice: 'abc',
        }),
      )
      .catch((err) => console.log(err));

    expect(response)
      .resolves.toHaveProperty('timestampInit')
      .catch((err) => console.log(err));
  });

  it('When createContact is called and is Double Initialized contact, then contactsModel should return undefined', () => {
    set(createContactBody, 'isInit', true);
    findOneMock.mockReturnValue(createContactInitializedResponse);

    const response = service.createContact(createContactBody);

    expect(response)
      .resolves.toEqual(undefined)
      .catch((err) => console.log(err));
  });

  it('When createContact is called and is Double end contact, then contactsModel should return undefined', () => {
    set(createContactBody, 'isInit', false);
    findOneMock.mockReturnValue(undefined);

    const response = service.createContact(createContactBody);

    expect(response)
      .resolves.toEqual(undefined)
      .catch((err) => console.log(err));
  });

  it('When buildData is called, then findContact should be called 1 times first response', async () => {
    findMock.mockImplementation(() => ({
      sort: sort2.mockResolvedValueOnce(firstCall),
    }));

    updateNearNodeMock.mockResolvedValue(true);
    getUsersAsNodesMock.mockReturnValueOnce(userResponseFirstCall);
    getUsersAsNodesMock.mockReturnValueOnce(userRequestSecondCall);

    const response = service.buildData('1');

    expect(findMock).toHaveBeenCalledTimes(1);
    expect(response)
      .resolves.toStrictEqual(expectedValue)
      .catch((err) => console.log(err));
  });

  it('When buildData is called, then findContact should be called 1 times', async () => {
    findMock.mockImplementation(() => ({
      sort: sort2.mockResolvedValueOnce([
        ...firstCall,
        {
          _id: '62ae3702391f822d8831cef4',
          idDevice: '4',
          idContactDevice: '3',
        },
        {
          _id: '62ae3702391f822d8831cadf',
          idDevice: '4',
          idContactDevice: '3',
        },
      ]),
    }));

    updateNearNodeMock.mockResolvedValue(true);
    getUsersAsNodesMock.mockReturnValueOnce(userResponseFirstCall);
    getUsersAsNodesMock.mockReturnValueOnce(userRequestSecondCall);

    const response = service.buildData('3');

    expect(findMock).toHaveBeenCalledTimes(1);
    expect(response)
      .resolves.toStrictEqual(twoExpected)
      .catch((err) => console.log(err));
  });

  it('When getContacts is called, then findContact should be called 1 times', async () => {
    findMock.mockClear();
    sort2.mockClear();

    findMock.mockImplementation(() => ({
      sort: sort2.mockResolvedValueOnce(getContactsMockRepsonse),
    }));
    countDocumentsMock.mockResolvedValue(2);
    findUserByIdDeviceMock.mockResolvedValue(USER_TEST_RESPONSE_MOCK);

    const response = await service.getContacts('1');

    expect(response).toEqual(getContactsDataTableResponse);
    expect(findMock).toHaveBeenCalledTimes(1);
    expect(countDocumentsMock).toHaveBeenCalledTimes(1);
    expect(findUserByIdDeviceMock).toHaveBeenCalledTimes(2);
  });

  it('When getContacts is called but find return empty array , then findContact should be called 1 times and getContactsDataTableResponse 0 times', async () => {
    findMock.mockImplementation(() => ({
      sort: sort2.mockResolvedValueOnce([]),
    }));
    countDocumentsMock.mockResolvedValue(2);
    findUserByIdDeviceMock.mockResolvedValue(USER_TEST_RESPONSE_MOCK);

    const response = await service.getContacts('1');

    expect(response).toEqual(undefined);
    expect(findMock).toHaveBeenCalledTimes(1);
    expect(countDocumentsMock).toHaveBeenCalledTimes(1);
    expect(findUserByIdDeviceMock).toHaveBeenCalledTimes(0);
  });
});
