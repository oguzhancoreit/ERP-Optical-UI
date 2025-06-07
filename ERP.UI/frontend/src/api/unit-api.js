import { createCrudApi } from './helpers/createCrudApi';

const BASE_URL = '/Unit';
const unitApi = createCrudApi(BASE_URL, 'UNIT');

export const getUnitPaged = unitApi.getPaged;
export const getUnitById = unitApi.getById;
export const createUnit = unitApi.create;
export const updateUnit = unitApi.update;
export const deleteUnit = unitApi.remove;
export const generateUnitCode = unitApi.generateCode;
