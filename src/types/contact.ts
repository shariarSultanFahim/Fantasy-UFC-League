export interface IContactPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface IContactResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    message: string;
  };
}
