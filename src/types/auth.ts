export interface ApiResponse {
  success: boolean;
  message: string;
}

export interface AuthUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface AuthResponse extends ApiResponse {
  user?: AuthUser;
}