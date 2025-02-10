import axios from "axios";

export interface UploadImageResponse {
  imageUrl: string;
}

export const uploadImage = async (
  formData: FormData
): Promise<UploadImageResponse> => {
  const response = await axios.post("/api/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  console.log("res: ", response.data);

  return response.data;
};
