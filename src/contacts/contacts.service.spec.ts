import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { ContactsService } from './contacts.service';
import { IContacts } from './interfaces/contacts.interface';

describe('ContactsService', () => {
  let service: ContactsService;

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
        ContactsService,
        {
          provide: getModelToken('contacts'),
          useValue: eventModel,
        },
      ],
    }).compile();

    service = module.get<ContactsService>(ContactsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('When createContact is called, then contactsModel should create new contact record', () => {
    const idDevice = 'abc';

    const response = service.createContact(idDevice);

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
});
