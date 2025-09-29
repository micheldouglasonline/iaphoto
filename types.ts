
export interface UploadedImage {
  dataUrl: string;
  base64: string;
  mimeType: string;
}

export interface EditImageResult {
  imageData: string | null;
  mimeType: string | null;
  text: string | null;
}
