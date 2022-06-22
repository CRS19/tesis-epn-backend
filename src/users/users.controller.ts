import { vinculateDeviceRequest } from './dto/vinculateDeviceRequest.dto';
import { CreateUserRequestDTO } from './dto/createUserRequest.dto';
import {
  Body,
  Controller,
  HttpStatus,
  Logger,
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
}
