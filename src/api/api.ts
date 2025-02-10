import axios from 'axios';

const BASE_URL = 'https://api.thedogapi.com/v1';

interface props {
  size: string;
  format: string;
  has_breeds: boolean;
  order: string;
  page: number;
  limit: number;
}

export const getDogImages = async ({ size, format, has_breeds, order, page, limit }: props) => {
  try {
    const res = await axios.get(
      `${BASE_URL}/images/search?size=${size}&format=${format}&has_breeds=${has_breeds}&order=${order}&page=${page}&limit=${limit}`
    );
    return res.data;
  } catch (error) {
    console.error('Error fetching dog images:', error);
    return [];
  }
};
