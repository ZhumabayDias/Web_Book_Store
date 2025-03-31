export interface Book{
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