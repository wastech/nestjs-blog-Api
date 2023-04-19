export interface JwtPayload {
    sub: string;
    email: string;
    // role: UserRole;
    iat?: number;
    exp?: number;
  }
  