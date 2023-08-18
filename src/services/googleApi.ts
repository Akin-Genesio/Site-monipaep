import axios from "axios";

export const googleApi = axios.create({
  baseURL: 'https://maps.googleapis.com',
})