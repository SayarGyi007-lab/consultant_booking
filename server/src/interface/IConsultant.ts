export interface IConsultant {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  expertise: string;
  bio: string;
  price: number;
  skills: string[];
  experience: number;
}

export interface IUpdateConsultant {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  expertise?: string;
  bio?: string;
  price?: number;
  skills?: string[];
  experience?: number;
}