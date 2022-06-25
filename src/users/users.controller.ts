import { RolesGuard } from './../auth/Guards/Roles.guard';
import { hasRoles } from './../auth/Decorators/roles.decorator';
import { rolesEnum } from './../auth/Enums/RolesEnum';
import { vinculateDeviceRequest } from './dto/vinculateDeviceRequest.dto';
import { CreateUserRequestDTO } from './dto/createUserRequest.dto';
import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Logger,
  Param,
  Patch,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { isNil } from 'lodash';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}
  private readonly logger = new Logger(UsersController.name);

  @Post('/Register')
  async createNewUser(
    @Res() response,
    @Body() createUserRequest: CreateUserRequestDTO,
  ) {
    this.logger.log(
      ` createNewUser | user to create -> ${createUserRequest.mail}`,
    );
    try {
      const newUser = await this.userService.createNewUser(createUserRequest);

      if (!isNil(newUser)) {
        response.status(HttpStatus.CREATED).json({
          message: 'ok',
        });

        return;
      }

      response.status(HttpStatus.NOT_ACCEPTABLE).json({
        message: 'User Already Exists',
      });

      return;
    } catch (e) {
      response.status(HttpStatus.NOT_MODIFIED).json({
        message: 'Error while create user',
      });
    }
  }

  @Patch('vinculateDevice')
  @UseGuards(AuthGuard('jwt'))
  async vinculateDevice(
    @Res() response,
    @Body() vinculateDevice: vinculateDeviceRequest,
  ) {
    this.logger.log(
      ` | vinculateDevice body -> ${vinculateDevice.mail} ${vinculateDevice.idDevice}`,
    );
    try {
      const { mail, idDevice } = vinculateDevice;
      const updatedResposne = await this.userService.vinculateDevice(
        mail,
        idDevice,
      );

      if (!isNil(updatedResposne)) {
        response.status(HttpStatus.OK).json({
          message: 'ok',
          updatedResposne,
        });
      } else {
        response.status(HttpStatus.NOT_MODIFIED).json({
          message: 'mail Incorrect',
        });
      }
    } catch (e) {
      response.status(HttpStatus.NOT_MODIFIED).json({
        message: 'Error while create user',
      });
    }
  }

  @Get('/:mail')
  @hasRoles(rolesEnum.USER)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async getUserByMail(@Res() response, @Param('mail') mail: string) {
    this.logger.log(` | getUserByMail mail -> ${mail} `);
    try {
      const user = await this.userService.getUserByMail(mail);

      if (!isNil(user)) {
        response.status(HttpStatus.OK).json({
          message: 'ok',
          user,
        });

        return;
      }

      response.status(HttpStatus.NOT_FOUND).json({
        message: 'User not found',
      });

      return;
    } catch (e) {
      response.status(HttpStatus.NOT_MODIFIED).json({
        message: 'Error while get user',
      });
    }
  }

  @Patch('/updateIsSick')
  @hasRoles(rolesEnum.USER)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async updateIsSick(
    @Res() response,
    @Body() updateIsSick: { mail: string; isSick: boolean },
  ) {
    this.logger.log(
      ` | updateIsSick body -> ${updateIsSick.mail} ${updateIsSick.isSick}`,
    );
    try {
      const { mail, isSick } = updateIsSick;
      const updatedResposne = await this.userService.updateIsSick(mail, isSick);

      if (!isNil(updatedResposne)) {
        response.status(HttpStatus.OK).json({
          message: 'ok',
          updatedResposne,
        });

        return;
      }

      response.status(HttpStatus.NOT_MODIFIED).json({
        message: 'mail Incorrect',
      });

      return;
    } catch (e) {
      this.logger.debug(e);
      response.status(HttpStatus.NOT_MODIFIED).json({
        message: 'Error while create user',
      });
    }
  }
}
