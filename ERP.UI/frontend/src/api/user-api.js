// src/api/user-api.js
import { createCrudApi } from './helpers/createCrudApi';

const BASE_URL = '/users';
const userApi = createCrudApi(BASE_URL, 'USER');

export const getUsersPaged = userApi.getPaged;
export const getUserById = userApi.getById;
export const createUser = userApi.create;
export const updateUser = userApi.update;
export const deleteUser = userApi.remove;
export const generateUserCode = userApi.generateCode; // sadece gerekiyorsa
