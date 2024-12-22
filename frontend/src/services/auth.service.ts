import { LOGIN_API, USER_PROFILE_API } from '@/constants/auth.api';
import * as api from './api.service';
import { TokenModel } from '@/models/token.model';
import TokenServices from './token.service';

const tokenService = new TokenServices();

export const login = async ({ username, password }: { username: string; password: string }) => {
  try {
    const data = await api.post({
      endpoint: LOGIN_API,
      data: {
        username: username.trim(),
        password,
      },
      requiresAuth: false,
    });
    const token = new TokenModel(data.data);
    tokenService.setToken(token);
  } catch (error) {
    console.error(error);
  }
};

export const getUserProfile = async () => {
  if (!tokenService.getAccessToken()) return;
  try {
    const { data } = await api.get({
      endpoint: USER_PROFILE_API,
    });
    return data;
  } catch (error) {
    console.error(error);
  }
};
