export enum UserRoleEnum {
  ADMIN = 'admin',
  USER = 'user',
}
export interface User{
  id: number;
  username: string;
  email: string;
  role: UserRoleEnum;
  tel:string;
  deletedAt: Date | null;
}
export interface UpdateUserDto {
  deletedAt: Date | null;
  username?: string;
  email?: string;
  password?: string;
  oldpassword?: string;
  tel?: string;
  role?: UserRoleEnum;
}

