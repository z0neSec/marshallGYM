import axios from 'axios';

const API_BASE_URL = 'https://api.example.com'; // Replace with your actual API base URL

export const fetchProducts = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/products`);
        return response.data;
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
};

export const fetchProductById = async (id) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/products/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching product with id ${id}:`, error);
        throw error;
    }
};

export const addToCart = async (product) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/cart`, product);
        return response.data;
    } catch (error) {
        console.error('Error adding to cart:', error);
        throw error;
    }
};

export const fetchCartItems = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/cart`);
        return response.data;
    } catch (error) {
        console.error('Error fetching cart items:', error);
        throw error;
    }
};

export const checkout = async (orderDetails) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/checkout`, orderDetails);
        return response.data;
    } catch (error) {
        console.error('Error during checkout:', error);
        throw error;
    }
};