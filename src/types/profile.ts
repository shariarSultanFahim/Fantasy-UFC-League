export interface AdminProfileFormValues {
  name: string;
  role?: any;
  email?: any;
  phone?: string;
  location?: string;
  bio?: string;
}

export interface AdminProfileState extends AdminProfileFormValues {
  timezone: string;
  avatarUrl?: string;
}
