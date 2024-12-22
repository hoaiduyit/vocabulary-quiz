import { TokenType } from "@/types/token.type";


export class TokenModel implements TokenType {

  expiresIn: number;

  accessToken: string;

  constructor({ expiresIn, accessToken  }: TokenType) {
    this.expiresIn = expiresIn;
    this.accessToken = accessToken;
  }
}
