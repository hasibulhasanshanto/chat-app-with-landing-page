import { User } from './user';

export interface LoginPayload {
  phone: string;
  name: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (phone: string, name: string) => Promise<User>;
  logout: () => void;
  updateUser: (user: User) => void;
}
