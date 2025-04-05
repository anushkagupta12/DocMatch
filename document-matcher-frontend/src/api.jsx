import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const testApi = async () => {
    try {
        const response = await axios.get(`${API_URL}/test`);
        return response.data;
    } catch (error) {
        console.error('Error fetching data from API:', error);
        throw error;
    }
};