import axios from 'axios';


const BASE_URL = 'http://localhost:8000';

export default axios.create({
    baseURL: BASE_URL
});

export const axiosPrivate = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
});

export const axiosPrivateForm = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    withCredentials: true
});