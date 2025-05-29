// src/api/role-api.js

import { createCrudApi } from './helpers/createCrudApi';

const BASE_URL = '/roles';
const roleApi = createCrudApi(BASE_URL, 'ROLE');

export const getRolesPaged  = roleApi.getPaged;
export const getRoleById    = roleApi.getById;
export const createRole     = roleApi.create;
export const updateRole     = roleApi.update;
export const deleteRole     = roleApi.remove;
// generateCode not needed for roles since they don't use codes
