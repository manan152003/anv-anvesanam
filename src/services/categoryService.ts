import type { Category } from '../types';

const API_URL = import.meta.env.VITE_API_URL;

// Utility function to join URL paths correctly
const joinUrl = (base: string, path: string): string => {
  return `${base.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`;
};

export const getCategories = async (): Promise<Category[]> => {
  const response = await fetch(joinUrl(API_URL, 'categories'));
  if (!response.ok) {
    throw new Error('Failed to fetch categories');
  }
  return response.json();
};

export const getCategoryById = async (categoryId: string): Promise<Category> => {
  const response = await fetch(joinUrl(API_URL, `categories/${categoryId}`));
  if (!response.ok) {
    throw new Error('Failed to fetch category');
  }
  return response.json();
}; 