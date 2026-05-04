export type LegalDocumentType = "PRIVACY_POLICY" | "TERMS_AND_CONDITIONS";

export interface ILegalDocument {
  id: string;
  type: LegalDocumentType;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface ILegalResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: ILegalDocument;
}

export interface ILegalListResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: ILegalDocument[];
}
