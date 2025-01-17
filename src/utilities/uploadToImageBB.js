import axios from "axios";

export const uploadToImageBB = async (imageData) => {
   const image = { image: imageData };
   const response = await axios.post(
      `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_imagebbAPI}`,
      image,
      { headers: { "content-type": "multipart/form-data" } }
   );
   return response.data?.data?.display_url || "";
};
