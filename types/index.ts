export interface Video {
  id: string;
  title: string;
  description: string | null;
  publicId: string;
  originalSize: string; // Corrected spelling
  compressedSize: string; // Corrected spelling
  duration: number;
  createdAt: Date;
  updatedAt: Date;
}
