import type { List, CreateListInput, UpdateListInput } from '../types';
import { apiRequest } from '../utils/api';

export const getUserLists = async (): Promise<List[]> => {
  return apiRequest<List[]>('/lists');
};

export const createList = async (input: CreateListInput): Promise<List> => {
  return apiRequest<List>('/lists', {
    method: 'POST',
    body: JSON.stringify(input),
  });
};

export const updateList = async (listId: string, input: UpdateListInput): Promise<List> => {
  return apiRequest<List>(`/lists/${listId}`, {
    method: 'PUT',
    body: JSON.stringify(input),
  });
};

export const deleteList = async (listId: string): Promise<void> => {
  return apiRequest<void>(`/lists/${listId}`, {
    method: 'DELETE',
  });
};

export const addVideoToList = async (listId: string, videoId: string): Promise<List> => {
  return apiRequest<List>(`/lists/${listId}/videos`, {
    method: 'POST',
    body: JSON.stringify({ videoId }),
  });
};

export const removeVideoFromList = async (listId: string, videoId: string): Promise<List> => {
  return apiRequest<List>(`/lists/${listId}/videos/${videoId}`, {
    method: 'DELETE',
  });
}; 