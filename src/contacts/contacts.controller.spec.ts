import { ContactsService } from './contacts.service';
import { Test, TestingModule } from '@nestjs/testing';
import { ContactsController } from './contacts.controller';

describe('ContactsController', () => {
  let controller: ContactsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContactsController],
      providers: [
        {
          provide: ContactsService,
          useValue: {
            createContact: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ContactsController>(ContactsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('when /init POST http method is called, then createContact should be called once', async () => {
    let jelp;
    const resposne = await controller.createContact(jelp, { idDevice: 'abc' });

    console.log(jelp);
  });
});
