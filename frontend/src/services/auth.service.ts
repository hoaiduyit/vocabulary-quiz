import {
  LOGIN_API,
  LOGIN_AS_GUEST_API,
  REGISTER_API,
  USER_PROFILE_API,
} from '@/constants/auth.api';
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

export const loginAsGuest = async (displayName: string) => {
  try {
    const data = await api.post({
      endpoint: LOGIN_AS_GUEST_API,
      data: {
        displayName,
      },
      requiresAuth: false,
    });
    const token = new TokenModel(data.data);
    tokenService.setToken(token);
  } catch (error) {
    console.error(error);
  }
};

export const register = async ({
  username,
  email = null,
  password,
  confirmPassword,
}: {
  username: string;
  email?: string | null;
  password: string;
  confirmPassword: string;
}) => {
  try {
    await api.post({
      endpoint: REGISTER_API,
      data: {
        username,
        email,
        password,
        confirmPassword,
      },
      requiresAuth: false,
    });
    await login({ username, password });
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
