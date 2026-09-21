export interface AuthenticatedUser {
  id: string;
  email: string;
  isAdmin: boolean;
  user_metadata?: {
    full_name?: string;
    name?: string;
    avatar_url?: string;
    picture?: string;
    [key: string]: any;
  };
  role?: string;
}
