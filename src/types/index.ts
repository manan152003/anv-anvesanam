export interface Category {
  _id: string;
  name: string;
  slug: string;
}

export interface List {
  _id: string;
  name: string;
  userId: string;
  videoItems: {
    videoId: string;
    submissionId?: string;
    addedAt: Date;
  }[];
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateListInput {
  name: string;
}

export interface UpdateListInput {
  name?: string;
} 