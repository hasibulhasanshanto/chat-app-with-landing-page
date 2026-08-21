export interface User {
  _id: string;
  name: string;
  phone: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SearchedUser {
  _id: string;
  name: string;
  phone: string;
}
