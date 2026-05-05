import { IApiResponse } from "./auth";

export interface IFighter {
  id: string;
  name: string;
  nickname: string;
  nationality: string;
  divisionId: string;
  rank: number | null;
  wins: number;
  losses: number;
  draws: number;
  avgL5: number;
  bio: string | null;
  avatarUrl: string | null;
  age: number | null;
  height: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  divisionRank?: number;
  division?: {
    id: string;
    name: string;
  };
}

export interface IPaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

export interface IFighterFilters {
  searchTerm?: string;
  divisionId?: string;
  isActive?: boolean;
  nationality?: string;
  minRank?: number;
  maxRank?: number;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  // UI-only helper for rank ranges
  rankRange?: string;
}

export interface IFighterResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: IFighter;
}

export interface IFighterListResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    meta: IPaginationMeta;
    data: IFighter[];
  };
}

export type Fighter = IFighter;
export type FighterFilters = IFighterFilters;
