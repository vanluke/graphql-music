import { IAuthService } from './AuthService';

export interface IServices {
  authService: IAuthService;
}
declare function getKeys<T extends object>(): (keyof T)[];

export const Services = getKeys<IServices>();

export type ServiceList = typeof Services;
