import { api } from '../api';
import { DrawingPools } from './types';

interface Get {
  limit?: number;
  offset?: number;
  order?: 'ASC' | 'DESC';
}

export const get = async ({ limit = 10, offset = 0, order = 'ASC' }: Get): Promise<DrawingPools> => {
  const url = `drawing-pool?limit=${limit}&offset=${offset}&order=${order}`
  return await api<DrawingPools>(url)
}