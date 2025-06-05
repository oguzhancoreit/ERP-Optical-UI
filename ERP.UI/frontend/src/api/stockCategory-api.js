import { createCrudApi } from './helpers/createCrudApi';

// Backend controller'ın ismine ve route'a uygun olmalı.
// Controller: [Route("api/[controller]")] → "api/StockCategory"
// O yüzden aşağıdaki gibi olmalı:
const BASE_URL = '/StockCategory';   // Büyük/küçük harf backend ile aynı olmalı!
const stockCategoryApi = createCrudApi(BASE_URL, 'STOCKCATEGORY'); // İkinci parametre (opsiyonel, log veya action için)

export const getStockCategoryPaged = stockCategoryApi.getPaged;
export const getStockCategoryById = stockCategoryApi.getById;
export const createStockCategory = stockCategoryApi.create;
export const updateStockCategory = stockCategoryApi.update;
export const deleteStockCategory = stockCategoryApi.remove;
export const generateStockCategoryCode = stockCategoryApi.generateCode;
