export interface Category {
  id: string;
  name: string;
  createdAt: number;
}

export interface Word {
  id: string;
  english: string;
  definition: string;
  thai: string;
  example: string;
  categoryId: string;
  createdAt: number;
}
