// src/api/role-api.js
import { createCrudApi } from './helpers/createCrudApi';

const roleApi = createCrudApi('/roles', 'ROLE');

export const getRolesPaged = roleApi.getPaged;
export const getRoleById = roleApi.getById;
export const createRole = roleApi.create;
export const updateRole = roleApi.update;
export const deleteRole = roleApi.remove;
