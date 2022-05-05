import { IsAlphanumeric, IsEmail, IsNotEmpty } from 'class-validator';

export class vinculateDeviceRequest {
  @IsNotEmpty({ message: 'Id device no debe estar vacio' })
  @IsAlphanumeric()
  idDevice: string;

  @IsNotEmpty({ message: 'Es requerido' })
  @IsEmail()
  mail: string;
}
