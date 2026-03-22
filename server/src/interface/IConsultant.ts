export interface IConsultant {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  expertise: string
}

export type IUpdateConsultant = Partial<Omit<IConsultant, "password">> & {
  password?: string;
};