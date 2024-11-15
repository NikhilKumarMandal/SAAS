export interface Video {
  id: string;
  title: string;
  description: string | null;
  publicId: string;
  originalSize: number; 
  compressedSize: number; 
  duration: number;
  createdAt: Date;
  updatedAt: Date;
  
}


