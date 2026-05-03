export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  bio?: string;
  location?: string;
  role: 'USER' | 'ADMIN';
  isVerified: boolean;
  createdAt: string;
}

export interface IApiResponse<T> {
  success: boolean;
  statusCode?: number;
  message: string;
  data: T;
}

export interface IPaginatedResponse<T> {
  success: boolean;
  statusCode?: number;
  message: string;
  data: {
    data: T[];
    meta: {
      page: number;
      limit: number;
      total: number;
      totalPage: number;
    };
  };
}


export interface ILoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export type AuthRole = 'USER' | 'ADMIN';

export interface AuthSession {
  accessToken: string;
  refreshToken: string;
  role: AuthRole;
}
