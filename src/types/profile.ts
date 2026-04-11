export interface AdminProfileFormValues {
  name: string;
  role: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
}

export interface AdminProfileState extends AdminProfileFormValues {
  timezone: string;
  imageUrl: string;
}
