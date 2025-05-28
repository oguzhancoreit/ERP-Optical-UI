import axios from '../../services/axios-instance';

export function createCrudApi(baseUrl, entityType = '') {
  return {
    getPaged: async (page = 1, pageSize = 10, search = '') => {
      const res = await axios.get(`${baseUrl}/paged`, { params: { page, pageSize, search } });
      return res.data;
    },
    getById: async (id) => {
      const res = await axios.get(`${baseUrl}/${id}`);
      return res.data;
    },
    create: async (data) => {
      const res = await axios.post(baseUrl, data);
      return res.data;
    },
    update: async (id, data) => {
      const res = await axios.put(`${baseUrl}/${id}`, data);
      return res.data;
    },
    remove: async (id) => {
      const res = await axios.delete(`${baseUrl}/${id}`);
      return res.data;
    },
    generateCode: async (storeCode = 'DEF') => {
      if (!entityType) throw new Error("entityType belirtilmedi.");
      const res = await axios.get(`/code/generate`, {
        params: { storeCode, entityType }
      });
      return res.data.code;
    }
  };
}
