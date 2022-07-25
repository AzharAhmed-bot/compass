import { BaseError } from "@core/errors/errors.base";
import { Credentials, TokenPayload } from "google-auth-library";

export interface Result_Auth_Compass {
  accessToken?: string | null;
  error?: BaseError;
}

export interface Result_Auth {
  cUserId?: string;
  error?: string | Record<string, unknown> | unknown[];
  success?: boolean;
}

export interface User_Google {
  id: string;
  email: string;
  family_name: string;
  given_name: string;
  locale: string;
  name: string;
  picture: string;
  verified_email: boolean;
  tokens: Credentials;
}
export interface UserInfo_Google {
  gUser: TokenPayload;
  tokens: Credentials;
}
