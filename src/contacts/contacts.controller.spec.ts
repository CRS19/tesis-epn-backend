import { IContactRequest } from './interfaces/contacts.interface';
import { ContactsService } from './contacts.service';
import { Test, TestingModule } from '@nestjs/testing';
import { ContactsController } from './contacts.controller';
import { Response } from 'express';
import { set } from 'lodash';

describe('ContactsController', () => {
  let controller: ContactsController;
  let bodyMock: IContactRequest = {
    idDevice: 'abc',
    idContactDevice: 'contactABC',
    rssi: 0,
    isInit: false,
  };
  let mockContactsReturnValue = {
    idDevice: 'myiddevice',
    idContactDevice: 'idContactDevice',
    rssi: -50,
    timestampInit: 1652154938619,
    timestampEnd: 1652155747284,
  };

  let responseJsonMock = {
    json: jest.fn((x) => x),
  };

  let responseMock = {
    status: jest.fn((x) => responseJsonMock),
    send: jest.fn((x) => x),
  } as unknown as Response;

  let createContactMock = jest.fn();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContactsController],
      providers: [
        {
          provide: ContactsService,
          useValue: {
            createContact: createContactMock,
          },
        },
      ],
    }).compile();

    controller = module.get<ContactsController>(ContactsController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('when /init POST http method is called, then createContact should return 201', async () => {
    createContactMock.mockReturnValue(mockContactsReturnValue);
    await controller.createContact(responseMock, bodyMock);

    expect(createContactMock).toHaveBeenCalledTimes(1);
    expect(responseMock.status).toHaveBeenCalledWith(201);
    expect(responseJsonMock.json).toHaveBeenCalledWith({ message: 'ok' });
  });

  it('when /init POST http method is called with out body info, then createContact should return 301', async () => {
    set(bodyMock, 'idDevice', undefined);
    createContactMock.mockRejectedValue({});

    await controller.createContact(responseMock, bodyMock);

    expect(createContactMock).toHaveBeenCalledTimes(1);
    expect(responseMock.status).toHaveBeenCalledWith(304);
    expect(responseJsonMock.json).toHaveBeenCalledWith({
      message: 'Error to create contact',
    });
  });

  it('when /init POST http method is called with body Info but is Double Initialized or Double end contact, then createContact should return 301', async () => {
    set(bodyMock, 'idDevice', 'abc');
    createContactMock.mockReturnValue(undefined);

    await controller.createContact(responseMock, bodyMock);

    expect(createContactMock).toHaveBeenCalledTimes(1);
    expect(responseMock.status).toHaveBeenCalledWith(304);
    expect(responseJsonMock.json).toHaveBeenCalledWith({
      message: 'Contacto no iniciado',
    });
  });
});
