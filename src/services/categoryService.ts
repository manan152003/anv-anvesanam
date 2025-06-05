import type { Category } from '../types';

const API_URL = import.meta.env.VITE_API_URL ;

export const getCategories = async (): Promise<Category[]> => {
  const response = await fetch(`${API_URL}/categories`);
  if (!response.ok) {
    throw new Error('Failed to fetch categories');
  }
  return response.json();
};

export const getCategoryById = async (categoryId: string): Promise<Category> => {
  const response = await fetch(`${API_URL}/categories/${categoryId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch category');
  }
  return response.json();
}; 