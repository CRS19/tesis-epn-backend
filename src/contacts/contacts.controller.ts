import { ContactsService } from './contacts.service';
import {
  Body,
  Controller,
  HttpStatus,
  Logger,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { hasRoles } from '../auth/Decorators/roles.decorator';
import { rolesEnum } from '../auth/Enums/RolesEnum';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/Guards/Roles.guard';
import { IContactRequest } from './interfaces/contacts.interface';
import { isNil } from 'lodash';

@Controller('contacts')
export class ContactsController {
  constructor(private contactsService: ContactsService) {}
  private readonly logger = new Logger(ContactsController.name);

  @Post('init')
  @hasRoles(rolesEnum.DEVICE)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async createContact(@Res() response, @Body() body: IContactRequest) {
    this.logger.log(
      ` POST | createContact contact idDevice -> ${body.idDevice} with idContactDevice -> ${body.idContactDevice}`,
    );

    try {
      const contactResponse = await this.contactsService.createContact(body);

      if (!isNil(contactResponse)) {
        response.status(HttpStatus.CREATED).json({
          message: 'ok',
        });

        this.logger.log(` POST | createContact success`);

        return;
      }

      response.status(HttpStatus.NOT_MODIFIED).json({
        message: 'Contacto no iniciado',
      });

      this.logger.error(
        ` POST | createContact Contact not initialized or Double Initialized`,
      );
    } catch (e) {
      console.log('error');
      response.status(HttpStatus.NOT_MODIFIED).json({
        message: 'Error to create contact',
      });

      this.logger.error(` POST | createContact can not create contact`);
    }
  }
}
