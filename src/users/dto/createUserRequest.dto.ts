import { INode } from './../../contacts/interfaces/buildData.interfaces';
import { IsBoolean, IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { IUser } from '../interfaces/users.interfaces';

export class CreateUserRequestDTO implements IUser {
  @IsNotEmpty({ message: 'El nombre es requerido' })
  @IsString()
  fullName: string;

  @IsNotEmpty({ message: 'Correo electrónico es requerido' })
  @IsEmail({ message: 'Debe ser un correo electrónico válido' })
  mail: string;

  @IsNotEmpty({ message: 'El password es requerido' })
  password: string;

  @IsNotEmpty({ message: 'El rol es requerido' })
  @IsString()
  rol: string;

  @IsString()
  idDevice: string;

  @IsBoolean({ message: 'El campo debe ser booleano' })
  isSick: boolean;

  @IsBoolean({ message: 'El campo debe ser booleano' })
  isPossibleSick: boolean;

  @IsBoolean({ message: 'El campo debe ser booleano' })
  isDevice: boolean;

  isPossibleSickTs: number;

  nearNodes: INode[];
}
