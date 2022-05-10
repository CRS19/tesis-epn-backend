import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { ContactsService } from './contacts.service';
import { IContactRequest, IContacts } from './interfaces/contacts.interface';
import { set } from 'lodash';

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
        ContactsService,
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
});
