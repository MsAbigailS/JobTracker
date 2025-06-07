import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:5000/api/jobs',
    headers: {
        'Content-Type': 'application/json',
    },
});

export default apiClient;
