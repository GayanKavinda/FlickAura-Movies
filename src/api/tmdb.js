import axios from 'axios';

const API_KEY = '3be3d6240008ba97e1e073581dadc972'; // Replace with your actual TMDb key

export const tmdb = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  params: {
    api_key: API_KEY,
    language: 'en-US',
  },
});
