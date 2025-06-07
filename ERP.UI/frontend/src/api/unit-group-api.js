import axios from '../services/axios-instance';
import { createCrudApi } from './helpers/createCrudApi';

const BASE_URL = '/UnitGroup';
const unitGroupApi = createCrudApi(BASE_URL, 'UNIT-GROUP');

export const getUnitGroupPaged = unitGroupApi.getPaged;
export const getUnitGroupById = unitGroupApi.getById;
export const createUnitGroup = unitGroupApi.create;
export const updateUnitGroup = unitGroupApi.update;
export const deleteUnitGroup = unitGroupApi.remove;
export const generateUnitGroupCode = unitGroupApi.generateCode;

// Tüm UnitGroup listesini ALL endpointinden getir
export async function getUnitGroups() {
  const res = await axios.get(`${BASE_URL}/all`);
  return res.data;
}
