export interface IDivision {
  id: string;
  name: string;
  _count?: {
    fighters: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface IDivisionFormValues {
  name: string;
}
