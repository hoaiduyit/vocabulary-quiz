import axios, { AxiosHeaders } from 'axios';
import TokenService from './token.service';

type Method = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

interface ApiMethod {
  endpoint: string;
  data?: any;
  requiresAuth?: boolean;
  params?: any;
  headers?: any;
}

interface ApiRequest extends ApiMethod {
  method: Method;
}

const tokenService = new TokenService();

const prepareOption = (
  method: Method,
  data: any,
  requiresAuth: boolean,
  headers: any,
  params: any,
) => {
  const option: any = {
    method,
    headers: {
      'Access-Control-Allow-Origin': '*',
      ...headers,
    },
    body: {},
  };

  if (requiresAuth) {
    const { accessToken } = tokenService.getAccessToken();
    option.headers = {
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${accessToken}`,
      ...headers,
    };
  }

  if (data) {
    if (method === 'GET') {
      option['params'] = { ...(params || {}) };
    } else {
      option['data'] = data;
      if (params) {
        option['params'] = params;
      }
    }
  }

  return option;
};

const apiRequest = async ({
  method,
  endpoint,
  data,
  requiresAuth = true,
  params = null,
  headers = {},
}: ApiRequest) => {
  const option = prepareOption(method, data, requiresAuth, headers, params);

  return axios(endpoint, option).then((resp) => resp as any);
};

export const get = ({ endpoint, data = {}, requiresAuth = true, headers = {} }: ApiMethod) =>
  apiRequest({
    method: 'GET',
    endpoint,
    data,
    requiresAuth,
    headers,
  });

export const post = ({ endpoint, data, requiresAuth = true, headers }: ApiMethod) =>
  apiRequest({
    method: 'POST',
    endpoint,
    data,
    requiresAuth,
    headers,
  });

export const put = ({ endpoint, data, requiresAuth = true, headers }: ApiMethod) =>
  apiRequest({
    method: 'PUT',
    endpoint,
    data,
    requiresAuth,
    headers,
  });
