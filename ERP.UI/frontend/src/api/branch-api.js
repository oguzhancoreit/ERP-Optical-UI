import { createCrudApi } from './helpers/createCrudApi';

const BASE_URL = '/branches';
const branchApi = createCrudApi(BASE_URL);

export const getBranchesPaged = branchApi.getPaged;
export const getBranchById = branchApi.getById;
export const createBranch = branchApi.create;
export const updateBranch = branchApi.update;
export const deleteBranch = branchApi.remove;
