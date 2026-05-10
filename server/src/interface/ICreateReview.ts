export interface ICreateReview{
  consultantId: string;
  userId: string;
  rating: number;
  comment?: string;
  bookingId: string
}

export interface IUpdateReview{

  rating?: number;
  comment?: string;

}