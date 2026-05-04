export interface INewsletter {
  id: string;
  title: string;
  description: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IMeta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

export interface INewsletterResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: INewsletter;
}

export interface INewsletterListResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    meta: IMeta;
    data: INewsletter[];
  };
}

export interface IUpsertNewsletterPayload {
  title: string;
  description: string;
  image?: File;
}
