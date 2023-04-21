export interface JwtPayload {
  sub: string;
  _id: string; // user ID
  name: string;
  email: string;
  roles: string[]; // user roles
  iat?: number; // issued at (optional)
  exp?: number; // expiration time (optional)
}
