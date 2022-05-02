import { ContactsService } from './contacts.service';
import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';

@Controller('contacts')
export class ContactsController {
  constructor(private contactsService: ContactsService) {}

  @Post('init')
  async createContact(@Res() response, @Body() body: { idDevice: string }) {
    try {
      await this.contactsService.createContact(body.idDevice);
      response.status(HttpStatus.CREATED).json({
        message: 'ok',
      });
    } catch (e) {}
  }
}
