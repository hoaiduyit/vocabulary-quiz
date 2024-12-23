import { TokenModel } from '@/models/token.model';
import { TokenType } from '@/types/token.type';

class TokenServices {
  constructor() {}

  setToken(tokenObj: TokenType) {
    const { accessToken } = new TokenModel(tokenObj);

    localStorage.setItem('token', accessToken);
  }

  getAccessToken() {
    const accessJson = localStorage.getItem('token');

    return {
      accessToken: accessJson,
    };
  }

  clearToken() {
    localStorage.removeItem('token');
  }
}

export default TokenServices;
