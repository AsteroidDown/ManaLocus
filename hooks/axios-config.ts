import { CubeApiUrl } from '@/constants/urls';
import axios from 'axios';

const cubeApiAxiosConfig = axios.create({
  baseURL: CubeApiUrl,
  headers: {
    'Content-Type': 'application/json', // change according header type accordingly
  },
});

export default cubeApiAxiosConfig;