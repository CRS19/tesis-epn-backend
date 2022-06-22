import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class vinculateDeviceRequest {
  @IsString()
  idDevice: string;

  @IsNotEmpty({ message: 'Es requerido' })
  @IsEmail()
  mail: string;
}
