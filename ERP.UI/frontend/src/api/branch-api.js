import axios from '../services/axios-instance';

const BASE_URL = '/branches';

// 🔹 Sayfalı + aramalı şube listesi
// @returns {Promise<{ items: { id, name, code, address, createdAt }[], totalCount: number }>}
export const getBranchesPaged = async (page = 1, pageSize = 10, search = '') => {
  const res = await axios.get(`${BASE_URL}/paged`, {
    params: { page, pageSize, search }
  });
  // Konsola yazdırarak veri kontrolü yapın:
  console.log('API response:', res.data);
  return res.data; // { items: BranchDto[], totalCount: number }
};


// 🔹 ID ile tek şube getir
// @returns {Promise<{ id, name, code, address, createdAt }>}
export const getBranchById = async (id) => {
  const res = await axios.get(`${BASE_URL}/${id}`);
  return res.data;
};

// 🔹 Yeni şube oluştur
// @param {{ name: string, code: string, address?: string }}
export const createBranch = async (data) => {
  const res = await axios.post(BASE_URL, data);
  return res.data;
};

// 🔹 Şube güncelle
export const updateBranch = async (id, data) => {
  const res = await axios.put(`${BASE_URL}/${id}`, data);
  return res.data;
};

// 🔹 Şube sil
export const deleteBranch = async (id) => {
  const res = await axios.delete(`${BASE_URL}/${id}`);
  return res.data;
};
