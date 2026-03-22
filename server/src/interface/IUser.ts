export interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  role?: "ADMIN" | "USER";
}

export type IUpdateUser = Partial<Omit<IUser, "password">> & {
  password?: string;
};