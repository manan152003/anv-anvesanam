export interface User {
  id: string;
  email: string;
  name: string;
  username: string;
  avatarUrl: string;
  bio?: string;
  role?: string;
} 

export interface List {
  _id: string;
  name: string;
  isDefault: boolean;
  videoItems: string[];
  userId: string;
  createdAt: string;
  updatedAt: string;
} 