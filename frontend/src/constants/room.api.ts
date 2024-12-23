import { BASE_URL } from '.';

export const CREATE_ROOM_API = `${BASE_URL}rooms`;
export const GET_ROOM_API = `${BASE_URL}rooms/{code}`;
export const JOIN_ROOM_API = `${BASE_URL}rooms/join/{code}`;
export const LEAVE_ROOM_API = `${BASE_URL}rooms/leave/{code}`;
export const GET_ROOM_SCOREBOARDS_API = `${BASE_URL}rooms/scoreboards/{code}`;
export const UPDATE_USER_SCORE_API = `${BASE_URL}rooms/scoreboards/update/{code}`;
