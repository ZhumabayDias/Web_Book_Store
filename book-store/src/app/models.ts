export interface Book{
  category: any;
  rating: number;
author: any;
price: any;
    id: string;
    title: string;
    authors: string[];
    publisher?: string;
    publishedDate?: string;
    description?: string;
    thumbnail?: string;
    images: string[];
    selectedImage?: string;
}