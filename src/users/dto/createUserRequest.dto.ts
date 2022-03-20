import { IsAlpha, IsBoolean, IsEmail, IsNotEmpty } from 'class-validator';
import { IUser } from '../interface/users.interfaces';

export class CreateUserRequestDTO implements IUser {
  @IsNotEmpty({ message: 'El nombre es requerido' })
  @IsAlpha('El nombre debe contener solo letras')
  fullName: string;

  @IsNotEmpty({ message: 'Correo electrónico es requerido' })
  @IsEmail({ message: 'Debe ser un correo electrónico válido' })
  mail: string;

  @IsNotEmpty({ message: 'El password es requerido' })
  password: string;

  @IsNotEmpty({ message: 'El id del dispositivo es requerido' })
  idDevice: string;

  @IsBoolean({ message: 'El campo debe ser booleano' })
  isSick: boolean;

  @IsBoolean({ message: 'El campo debe ser booleano' })
  isPosibleSick: boolean;
}
