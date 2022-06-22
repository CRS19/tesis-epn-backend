import { IUser } from './../../users/interfaces/users.interfaces';
export interface JWTPayload {
  user: Partial<IUser>;
}
