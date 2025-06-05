
import { createCrudApi } from './helpers/createCrudApi';

// BASE_URL PascalCase ve tekil: örn: /StockGroup
const BASE_URL = '/StockGroup';
const stockGroupApi = createCrudApi(BASE_URL, 'STOCK-GROUP');

// Fonksiyonlar tekil!
export const getStockGroupPaged = stockGroupApi.getPaged;
export const getStockGroupById = stockGroupApi.getById;
export const createStockGroup = stockGroupApi.create;
export const updateStockGroup = stockGroupApi.update;
export const deleteStockGroup = stockGroupApi.remove;
export const generateStockGroupCode = stockGroupApi.generateCode;
