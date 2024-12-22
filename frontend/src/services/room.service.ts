import { CREATE_ROOM_API, GET_ROOM_API, JOIN_ROOM_API, LEAVE_ROOM_API } from '@/constants/room.api';
import * as api from './api.service';

export const getRoomByCode = async (code: string) => {
  try {
    const { data } = await api.get({
      endpoint: GET_ROOM_API.replace('{code}', code),
      requiresAuth: false,
    });
    return data;
  } catch (error) {
    console.error(error);
  }
};

export const createRoom = async () => {
  try {
    const { data } = await api.post({
      endpoint: CREATE_ROOM_API,
    });
    return data;
  } catch (error) {
    console.error(error);
  }
};

export const joinRoom = async (code: string) => {
  try {
    await api.put({
      endpoint: JOIN_ROOM_API.replace('{code}', code),
    });
  } catch (error) {
    console.error(error);
  }
};

export const leaveRoom = async (code: string) => {
  try {
    await api.put({
      endpoint: LEAVE_ROOM_API.replace('{code}', code),
    });
  } catch (error) {
    console.error(error);
  }
};
