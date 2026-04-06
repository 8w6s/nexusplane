import axios from 'axios';

// Chúng ta sẽ trỏ thẳng tới Fiber backend chạy trên port 8080 trong lúc dev. 
// Lúc build production (1 binary), nó sẽ dùng current host (tức là /api/v1)
export const apiClient = axios.create({
  baseURL: process.env.NODE_ENV === 'development' ? 'http://localhost:8080/api/v1' : '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetcher = (url: string) => apiClient.get(url).then((res) => res.data);
